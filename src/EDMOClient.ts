// Bloom note: Don't edit this file. It's a copy of the original EDMOClient.ts file from the EDMO client project.

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

    private _id = -1;

    public constructor(serverURL: string = "ws://localhost:8080") {
        this.pc = new RTCPeerConnection(EDMOClient.ICE_SERVERS);
        this.ws = new WebSocket(serverURL);
        this.dataChannel = this.pc.createDataChannel('channel');

        this.dataChannel.onmessage = this.onDataChannelMessage.bind(this);
        this.ws.onopen = this.webSocketOpen.bind(this);
        this.ws.onmessage = this.onWebSocketMessage.bind(this);
    }

    public get ID(): number {
        return this._id;
    }

    private set ID(id: number) {
        this._id = id;
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
        this.dataChannel.send(message);
    }

    public onDataChannelMessage(event: MessageEvent<string>): void {
        console.log("Received message:", event.data);
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
            case "SUCCESS":
                this.ID = data.identifier;
                const answer = JSON.parse(data.data);
                console.log(answer);
                if (answer.type === 'answer')
                    this.pc.setRemoteDescription(new RTCSessionDescription(answer));
                else if (answer.candidate) {
                    this.pc.addIceCandidate(new RTCIceCandidate(data));
                }

                break;
            case "SERVER_FULL":
                console.log("Server is full");
                break;

        }
    }
}
