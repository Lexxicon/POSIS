interface WombatProcessConstructor extends PosisProcessConstructor{
    new (context: IPosisProcessContext): WombatProcess | IPosisProcess;
}
