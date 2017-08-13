interface PosisInterfaces {
    wombatSleepExtension: WombatSleepExtension;
}

interface WombatSleepExtension extends IPosisSleepExtension{
    // puts currently running process to sleep for a given number of ticks
    sleep(ticks: number, pid?: PosisPID): void;
}
