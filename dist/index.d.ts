type PosisPID = string | number;

interface PosisInterfaces {
	baseKernel: IPosisKernel;
	spawn: IPosisSpawnExtension;
	sleep: IPosisSleepExtension;
	coop: IPosisCooperativeScheduling;
}
// Bundle for programs that are logically grouped
interface IPosisBundle<IDefaultRootMemory> {
	// host will call that once, possibly outside of main loop, registers all bundle processes here
	install(registry: IPosisProcessRegistry): void;
	// image name of root process in the bundle, if any
	rootImageName?: string;
	// function returning default starting memory for root process, doubles as public parameter documentation
	makeDefaultRootMemory?: (override?: IDefaultRootMemory) => IDefaultRootMemory;
}
interface IPosisExtension {}
interface IPosisKernel extends IPosisExtension {
    startProcess(imageName: string, startContext: any): { pid: PosisPID; process: IPosisProcess } | undefined;
    // killProcess also kills all children of this process
    // note to the wise: probably absorb any calls to this that would wipe out your entire process tree.
    killProcess(pid: PosisPID): void;
    getProcessById(pid: PosisPID): IPosisProcess | undefined;

    // passing undefined as parentId means "make me a root process"
    // i.e. one that will not be killed if another process is killed
    setParent(pid: PosisPID, parentId?: PosisPID): boolean;
}
interface IPosisLogger {
    // because sometimes you don't want to eval arguments to ignore them
    debug(message: (() => string) | string): void;
    info(message: (() => string) | string): void;
    warn(message: (() => string) | string): void;
    error(message: (() => string) | string): void;
}
interface IPosisProcessContext {
    readonly memory: any; // private memory
    readonly imageName: string; // image name (maps to constructor)
    readonly id: PosisPID; // ID
    readonly parentId: PosisPID; // Parent ID
    readonly log: IPosisLogger; // Logger 
    queryPosisInterface<T extends keyof PosisInterfaces>(interfaceId: T): PosisInterfaces[T] | undefined;
}

// Bundle: Don't write to context object (including setting new props on it), host will likely freeze it anyway. 
// Host: freeze the thing!
interface PosisProcessConstructor {
    new (context: IPosisProcessContext): IPosisProcess;
}

interface IPosisProcess {
    // Main function, implement all process logic here. 
    run(): void; 
}
interface IPosisProcessRegistry {
	// name your processes' image names with initials preceding, like ANI/MyCoolPosisProgram (but the actual class name can be whatever you want)
	// if your bundle consists of several programs you can pretend that we have a VFS: "ANI/MyBundle/BundledProgram1"
	register(imageName: string, constructor: new (context: IPosisProcessContext) => IPosisProcess): boolean;
}
interface IPosisCooperativeScheduling {
    // CPU used by process so far. Might include setup time kernel chooses to charge to the process.
    readonly used: number;
    // CPU budget scheduler allocated to this process.
    readonly budget: number;
    // Process can wrap function and yield when it is ready to give up for the tick or can continue if CPU is available.
    // optionally yield a shutdown function to perform shutdown tasks like saving current state
    wrap?(makeIterator: () => IterableIterator<void | (() => void)>): void;
}
interface IPosisSleepExtension {
    // puts currently running process to sleep for a given number of ticks
    sleep(ticks: number): void;
}
declare const enum EPosisSpawnStatus {
    ERROR = -1,
    QUEUED,
    SPAWNING,
    SPAWNED
}

// NOT FINAL, discussions still underway in slack #posis

// process calls spawnCreep, checks status, if not ERROR, poll 
// getStatus until status is SPAWNED (Handling ERROR if it happens),
// then call getCreep to get the creep itself

interface IPosisSpawnExtension {
    // Queues/Spawns the creep and returns an ID
    spawnCreep(opts: { 
        //   - 'rooms' are names of rooms associated with the creep being spawned.
        //     Must contain at least one room. Host should select spawner based on its own logic
        //     May contain additional rooms as a hints to host. Host may ignore hints
        rooms: string[], 
        //   - 'body' are body variants of the creep being spawned, at least one must be provided
        //     Host must guarantee that the spawning creep will have one of provided bodies
        //     Which body to spawn is up to host to select based on its own logic
        //     Body templates should be sorted in the order of diminishing desirability
        body: string[][], 
        //   - 'priority' is spawn priority in range -1000 (the highest) to 1000 (the lowest)
        //     Used as a hint for host's logic. Host may (but not guarantee) spawn creeps in priority order
        priority?: number, 
        //   - 'pid' is id of the process which is spawned creep associated to
        //     Used as a hint for host's logic. Host may (but not guarantee) consider currently spawned creeps
        //     detached, may (but not guarantee) remove scheduled creeps from queue on process termination
        pid?: PosisPID }): string;
    // Used to see if its been dropped from queue
    getStatus(id: string): {
        status: EPosisSpawnStatus
        message?: string
    }
    getCreep(id: string): Creep | undefined;
}
interface PosisInterfaces {
 extensionRegistry: WombatExtensionRegistry;
}

interface WombatExtensionRegistry extends IPosisExtension {
  register(interfaceId: keyof PosisInterfaces, extension: IPosisExtension): boolean;

  unregister(interfaceId: keyof PosisInterfaces): boolean;

  getExtension(interfaceId: keyof PosisInterfaces): IPosisExtension | undefined;
}

interface PosisInterfaces {
  wombatKernel: WombatKernel;
}

interface WombatKernel extends IPosisKernel {
  notify(pid: PosisPID, msg: WombatMessage): void;
  getProcessById(pid: PosisPID): WombatProcess | undefined;
  startProcess(imageName: string, startContext: any): { pid: PosisPID; process: WombatProcess; } | undefined 
}
interface WombatLoggerFactory extends IPosisExtension{
  getLogger(name: string): IPosisLogger;
}
interface WombatMessage {
    type: keyof Messages;
}

interface InteruptMessage extends WombatMessage{
    info: string;
}

interface Messages{
    interupt: InteruptMessage
}
interface WombatProcess extends IPosisProcess {
  /** post a message to this process */
  notify(msg: WombatMessage): void;
}
interface WombatProcessConstructor extends PosisProcessConstructor{
    new (context: IPosisProcessContext): WombatProcess | IPosisProcess;
}
interface WombatProcessInfo {
  id: PosisPID;
  parentId: PosisPID;
  name: string;

  status: ProcessStatus;
  error?: string;

  startTick: number;
  wakeTick?: number;
  endedTick?: number;
}
interface WombatProcessRegistry extends IPosisProcessRegistry {
  register(imageName: string, constructor: WombatProcessConstructor): boolean;
  getNewProcess(context: IPosisProcessContext): WombatProcess | undefined;
}
declare const enum ProcessStatus {
  SLEEP,
  STARTING,
  RUNNING,
  DONE,
  KILLLED,
  ERROR,
}
interface PosisInterfaces {
    wombatSleepExtension: WombatSleepExtension;
}

interface WombatSleepExtension extends IPosisSleepExtension{
    // puts currently running process to sleep for a given number of ticks
    sleep(ticks: number, pid?: PosisPID): void;
}
