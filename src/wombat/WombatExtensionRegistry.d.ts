interface PosisInterfaces {
  wombatExtensionRegistry: WombatExtensionRegistry;
}

interface WombatExtensionRegistry extends IPosisExtension {
  register(interfaceId: string, extension: IPosisExtension): boolean;

  unregister(interfaceId: string): boolean;

  getExtension(interfaceId: string): IPosisExtension | undefined;
}
