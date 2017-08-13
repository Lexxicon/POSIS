interface WombatMessage {
    type: keyof Messages;
}

interface Messages{
    interupt: WombatMessage
}
