export type DataChannelMessageCallback = (receivedMessage: string) => void;
export class EDMOClient {
    private static readonly ICE_SERVERS: RTCConfiguration = {
        iceServers: [
            {
                urls: "stun:stun.relay.metered.ca:80",
            },
            {
                urls: "turn:a.relay.metered.ca:80",
                username: "e3e28e4f25f3c94a995bc9dd",
                credential: "VSg2ZCdBfND7hEgA",
            },
            {
                urls: "turn:a.relay.metered.ca:80?transport=tcp",
                username: "e3e28e4f25f3c94a995bc9dd",
                credential: "VSg2ZCdBfND7hEgA",
            },
            {
                urls: "turn:a.relay.metered.ca:443",
                username: "e3e28e4f25f3c94a995bc9dd",
                credential: "VSg2ZCdBfND7hEgA",
            },
            {
                urls: "turn:a.relay.metered.ca:443?transport=tcp",
                username: "e3e28e4f25f3c94a995bc9dd",
                credential: "VSg2ZCdBfND7hEgA",
            },
        ]
    };

    private readonly pc: RTCPeerConnection;
    private readonly ws: WebSocket;
    private readonly dataChannel: RTCDataChannel;
    private readonly callbacks: DataChannelMessageCallback[] = [];

    private readonly name: string;

    private overrideIndex: number | null = null;

    public constructor(name: string, serverURL: string = "ws://localhost:8080", onMessageHandler: DataChannelMessageCallback[] = [], overrideIndex: number | null = null) {
        if (!this.checkWebSocketURL(serverURL))
            throw new Error("Invalid WebSocket URL");

        this.name = name;
        this.overrideIndex = overrideIndex;
        this.pc = new RTCPeerConnection(/*EDMOClient.ICE_SERVERS*/);
        this.ws = new WebSocket(serverURL);

        this.pc.oniceconnectionstatechange = this.onConnectionStateChange.bind(this);
        this.dataChannel = this.pc.createDataChannel('channel');

        this.dataChannel.onmessage = this.onDataChannelMessage.bind(this);
        this.ws.onopen = this.webSocketOpen.bind(this);
        this.ws.onmessage = this.onWebSocketMessage.bind(this);

        onMessageHandler.forEach(h => {
            this.OnDataChannelMessage(h);
        }, this);

        window.addEventListener("beforeunload", () => this.close());
    }

    private checkWebSocketURL(url: string): boolean {
        return url.startsWith("ws://") || url.startsWith("wss://");
    }

    private connectionStateChangedHandlers: ((state: RTCIceConnectionState) => void)[] = [];

    public OnConnectionStateChange(callback: (state: RTCIceConnectionState) => void) {
        this.connectionStateChangedHandlers.push(callback);
    }

    private onConnectionStateChange() {
        this.connectionStateChangedHandlers.forEach(callback => callback(this.pc.iceConnectionState));
    }

    public sendMessage(message: string): void {
        if (this.dataChannel.readyState != "open")
            return;

        this.dataChannel.send(message);
    }

    private onDataChannelMessage(event: MessageEvent<string>) {
        this.callbacks.forEach(callback => callback(event.data));
        console.log("Received message:", event.data);
    }

    public OnDataChannelMessage(callback: DataChannelMessageCallback) {
        this.callbacks.push(callback);
    }

    private async webSocketOpen() {
        const pc = this.pc; // Store reference to pc variable
        const ws = this.ws; // Store reference to ws variable

        const offer = await pc.createOffer();

        await pc.setLocalDescription(offer);
        let info: any = {};

        if (this.overrideIndex != null) {
            info = {
                "playerName": this.name,
                "handshake": JSON.stringify(offer),
                "overrideID": this.overrideIndex
            };
        }
        else {
            info = {
                "playerName": this.name,
                "handshake": JSON.stringify(offer)
            };
        }

        ws.send(JSON.stringify(info));
    };

    private async onWebSocketMessage(event: MessageEvent<string>) {
        const data = JSON.parse(event.data);
        await this.pc.setRemoteDescription(new RTCSessionDescription(data));

        this.ws.close();
    }

    public close(): void {
        this.sendMessage("CLOSE");
        this.dataChannel.close();
        this.pc.close();
        this.ws.close();
    }
}
