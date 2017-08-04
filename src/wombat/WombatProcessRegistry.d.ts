interface WombatProcessRegistry extends IPosisProcessRegistry {
  getNewProcess(context: IPosisProcessContext): IPosisProcess | undefined;
}