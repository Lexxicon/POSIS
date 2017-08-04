interface WombatLoggerFactory extends IPosisExtension{
  getLogger(name: string): IPosisLogger;
}
