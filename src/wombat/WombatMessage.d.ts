interface WombatMessage {
    type: keyof Messages;
}

interface InteruptMessage extends WombatMessage{
    info: string;
}

interface Messages{
    interupt: InteruptMessage
}
