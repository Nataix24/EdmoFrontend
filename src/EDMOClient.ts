type DataChannelMessageCallback = (receivedMessage: string) => void;
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

    private _id = -1;
    private _simpleMode = false;

    public constructor(serverURL: string = "ws://localhost:8080") {
        if (!this.checkWebSocketURL(serverURL))
            throw new Error("Invalid WebSocket URL");

        this.pc = new RTCPeerConnection(EDMOClient.ICE_SERVERS);
        this.ws = new WebSocket(serverURL);

        this.pc.oniceconnectionstatechange = this.onConnectionStateChange.bind(this);
        this.dataChannel = this.pc.createDataChannel('channel');

        this.dataChannel.onmessage = this.onDataChannelMessage.bind(this);
        this.ws.onopen = this.webSocketOpen.bind(this);
        this.ws.onmessage = this.onWebSocketMessage.bind(this);
    }

    private checkWebSocketURL(url: string): boolean {
        return url.startsWith("ws://") || url.startsWith("wss://");
    }

    public get simpleMode(): boolean {
        return this._simpleMode;
    }
    public set simpleMode(enabled: boolean) {
        this._simpleMode = enabled;
    }

    public get ID(): number {
        return this._id;
    }

    private set ID(id: number) {
        this._id = id;
    }

    private connectionStateChangedHandlers: ((state: RTCIceConnectionState) => void)[] = [];

    public OnConnectionStateChange(callback: (state: RTCIceConnectionState) => void) {
        this.connectionStateChangedHandlers.push(callback);
    }

    private onConnectionStateChange() {
        this.connectionStateChangedHandlers.forEach(callback => callback(this.pc.iceConnectionState));
    }

    public async waitForId(timeout: number) {
        var counter: number = 0;
        while (counter < timeout) {
            if (this.ID >= 0)
                return;

            const step = Math.min(timeout - counter, 50);
            counter += step;
            await new Promise(resolve => setTimeout(resolve, step)); // Wait for 100 milliseconds
        }
    }

    public sendMessage(message: string): void {
        if (this.dataChannel.readyState === "closed")
            return;

        this.dataChannel.send(message);
    }

    private onDataChannelMessage(event: MessageEvent<string>): void {
        if (event.data === "close") {
            this.close();
            return;
        }

        this.callbacks.forEach(callback => callback(event.data));
        console.log("Received message:", event.data);
    }

    public OnDataChannelMessage(callback: DataChannelMessageCallback) {
        this.callbacks.push(callback);
    }

    private webSocketOpen = (): void => {
        console.log("OPEN");

        const pc = this.pc; // Store reference to pc variable
        const ws = this.ws; // Store reference to ws variable

        pc.createOffer().then((offer) => {
            pc.setLocalDescription(offer);
            ws.send(JSON.stringify(offer));
        });
    };

    private onWebSocketMessage(event: MessageEvent<string>): void {
        const data = JSON.parse(event.data);

        switch (data.type) {
            case "GUIMODE":
                this.simpleMode = Boolean(data.data);
                break;

            case "SUCCESS":
                const answer = JSON.parse(data.data);
                console.log(answer);
                if (answer.type === 'answer')
                    this.pc.setRemoteDescription(new RTCSessionDescription(answer));
                else if (answer.candidate) {
                    this.pc.addIceCandidate(new RTCIceCandidate(data));
                }
                this.ID = data.identifier;
                break;
            case "SERVER_FULL":
                console.log("Server is full");
                break;
        }
    }

    public close(userTriggered: boolean = false): void {
        if (userTriggered)
            this.dataChannel.send("close");
        this.dataChannel.close();
        this.pc.close();
        this.ws.close();
    }
}
