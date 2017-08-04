interface WombatExtensionRegistry {
  register(interfaceId: string, extension: IPosisExtension): boolean;

  unregister(interfaceId: string): boolean;

  getExtension(interfaceId: string): IPosisExtension | undefined;
}
