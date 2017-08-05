interface WombatProcessRegistry extends IPosisProcessRegistry {
	register(imageName: string, constructor: WombatProcessConstructor): boolean;
  getNewProcess(context: IPosisProcessContext): WombatProcess | undefined;
}
