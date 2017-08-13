interface PosisInterfaces {
 extensionRegistry: WombatExtensionRegistry;
}

interface WombatExtensionRegistry extends IPosisExtension {
  register(interfaceId: keyof PosisInterfaces, extension: IPosisExtension): boolean;

  unregister(interfaceId: keyof PosisInterfaces): boolean;

  getExtension(interfaceId: keyof PosisInterfaces): IPosisExtension | undefined;
}
