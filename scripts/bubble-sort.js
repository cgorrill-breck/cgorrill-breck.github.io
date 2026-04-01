const { useState, useEffect, useCallback } = React;

// Inline SVG Icons (Replacing lucide-react dependencies for single-file portability)
const Play = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>;
const Pause = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>;
const StepForward = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>;
const RotateCcw = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>;
const Shuffle = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>;
const ArrowDownUp = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 16 4 4 4-4" /><path d="M7 20V4" /><path d="m21 8-4-4-4 4" /><path d="M17 4v16" /></svg>;

const INITIAL_ARRAY = [5, 2, 8, 1, 4];

function BubbleSortVisualizer() {
    const [initialArray, setInitialArray] = useState([...INITIAL_ARRAY]);
    const [array, setArray] = useState([...INITIAL_ARRAY]);
    const [i, setI] = useState(0);
    const [j, setJ] = useState(0);
    const [stepState, setStepState] = useState('COMPARING');
    const [isAscending, setIsAscending] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(800);
    const [log, setLog] = useState("Ready to start! Click 'Step' or 'Play'.");

    const isComplete = stepState === 'DONE';

    const reset = useCallback((newArr = initialArray, newDir = isAscending) => {
        setIsPlaying(false);
        setArray([...newArr]);
        setInitialArray([...newArr]);
        setIsAscending(newDir);
        setI(0);
        setJ(0);
        setStepState('COMPARING');
        setLog(`Ready to sort in ${newDir ? 'Ascending' : 'Descending'} order.`);
    }, [initialArray, isAscending]);

    const randomize = () => {
        const newArr = Array.from({ length: 5 }, () => Math.floor(Math.random() * 9) + 1);
        reset(newArr, isAscending);
    };

    const handleStep = useCallback(() => {
        if (isComplete) return;

        if (stepState === 'COMPARING') {
            const a = array[j];
            const b = array[j + 1];
            const needsSwap = isAscending ? a > b : a < b;

            if (needsSwap) {
                const newArr = [...array];
                [newArr[j], newArr[j + 1]] = [newArr[j + 1], newArr[j]];
                setArray(newArr);
                setStepState('SWAPPED');
                setLog(`${a} ${isAscending ? '>' : '<'} ${b}, so they are out of order. Swapped!`);
            } else {
                setStepState('OK');
                setLog(`${a} is in the correct order relative to ${b}.`);
            }
        } else if (stepState === 'SWAPPED' || stepState === 'OK') {
            if (j + 1 >= array.length - i - 1) {
                const newI = i + 1;
                setI(newI);
                setJ(0);
                if (newI >= array.length - 1) {
                    setStepState('DONE');
                    setIsPlaying(false);
                    setLog("Sorting Complete! 🎉");
                } else {
                    setStepState('COMPARING');
                    setLog(`End of pass. The ${isAscending ? 'largest' : 'smallest'} remaining item is locked. Moving to next pass.`);
                }
            } else {
                setJ(j + 1);
                setStepState('COMPARING');
                setLog("Moving to the next pair.");
            }
        }
    }, [array, i, j, stepState, isAscending, isComplete]);

    useEffect(() => {
        let timer;
        if (isPlaying && !isComplete) {
            timer = setTimeout(handleStep, speed);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, isComplete, handleStep, speed]);

    const toggleDirection = () => {
        reset(initialArray, !isAscending);
    };

    const getBarColor = (index) => {
        if (isComplete) return 'bg-emerald-500';
        if (index >= array.length - i) return 'bg-emerald-600';

        if (stepState === 'COMPARING' && (index === j || index === j + 1)) return 'bg-yellow-400';
        if (stepState === 'SWAPPED' && (index === j || index === j + 1)) return 'bg-orange-500';
        if (stepState === 'OK' && (index === j || index === j + 1)) return 'bg-lime-400';

        return 'bg-slate-300';
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 p-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">

                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-slate-900">Bubble Sort Visualizer</h1>
                    <p className="text-slate-600 text-lg">Watch the elements bubble to their correct positions.</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">

                    <div className="h-16 flex items-center justify-center mb-8 bg-slate-100 rounded-lg">
                        <p className="text-xl font-medium text-slate-700">
                            {log}
                        </p>
                    </div>

                    <div className="flex justify-center items-end h-48 gap-4 mb-12">
                        {array.map((val, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2">
                                <div
                                    className={`w-16 rounded-t-md transition-all duration-300 ${getBarColor(idx)} shadow-sm`}
                                    style={{ height: `${val * 15}px` }}
                                ></div>
                                <div className={`w-16 h-16 flex items-center justify-center rounded-lg text-2xl font-bold transition-colors duration-300 ${getBarColor(idx)} text-white shadow-sm`}>
                                    {val}
                                </div>
                                <div className="h-6 flex items-center justify-center">
                                    {!isComplete && idx < array.length - i && (idx === j || idx === j + 1) && (
                                        <span className="text-slate-400 font-bold text-xl">↑</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col items-center gap-6 border-t border-slate-100 pt-8">
                        <div className="flex flex-wrap justify-center items-center gap-4">
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                disabled={isComplete}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-colors ${isPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                                {isPlaying ? 'Pause' : 'Auto-Play'}
                            </button>

                            <button
                                onClick={handleStep}
                                disabled={isComplete || isPlaying}
                                className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-slate-800 text-white hover:bg-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <StepForward size={20} /> Next Step
                            </button>

                            <button
                                onClick={() => reset(initialArray)}
                                className="p-3 rounded-full bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
                                title="Restart"
                            >
                                <RotateCcw size={20} />
                            </button>

                            <button
                                onClick={randomize}
                                className="p-3 rounded-full bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
                                title="Randomize Array"
                            >
                                <Shuffle size={20} />
                            </button>
                        </div>

                        <div className="flex flex-wrap items-center justify-between w-full max-w-md gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-600">Speed:</span>
                                <input
                                    type="range"
                                    min="200"
                                    max="1500"
                                    step="100"
                                    value={1700 - speed}
                                    onChange={(e) => setSpeed(1700 - parseInt(e.target.value))}
                                    className="w-24 accent-indigo-600"
                                />
                            </div>

                            <button
                                onClick={toggleDirection}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                            >
                                <ArrowDownUp size={18} />
                                Sort: {isAscending ? 'Ascending' : 'Descending'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            📝 FRQ Prep: The Code Logic
                        </h3>
                        <p className="text-sm text-slate-600 mb-4">
                            Watch how changing the sort direction alters <strong>only the comparison operator</strong> in the code.
                        </p>
                        <pre className="bg-slate-800 text-slate-50 p-4 rounded-xl text-sm overflow-x-auto shadow-inner">
                            <code>
                                <span className="text-slate-400">// Outer pass loop</span>
                                {`for (int i = 0; i < array.length - 1; i++) {
`}
                                <span className="text-slate-400">  // Inner adjacent pair loop</span>
                                {`  for (int j = 0; j < array.length - i - 1; j++) {

`}
                                <span className="text-slate-400">    // Swap if out of order</span>
                                {`    `}
                                <span className="bg-indigo-600/50 px-2 py-1 rounded inline-block">
                                    {`if (array[j] ${isAscending ? '>' : '<'} array[j + 1]) {`}
                                </span>
                                {`
          int temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
        }
      }
    }`}
                            </code>
                        </pre>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                        <h3 className="text-lg font-bold text-slate-800 mb-2">
                            Color Legend
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded bg-yellow-400 shrink-0"></div>
                                <span className="text-sm font-medium text-slate-700">Comparing: Checking if they are out of order.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded bg-orange-500 shrink-0"></div>
                                <span className="text-sm font-medium text-slate-700">Swapped: Elements were out of order and moved.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded bg-lime-400 shrink-0"></div>
                                <span className="text-sm font-medium text-slate-700">In Order: No swap needed.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded bg-emerald-600 shrink-0"></div>
                                <span className="text-sm font-medium text-slate-700">Locked: Safely in its final sorted position.</span>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('bubble-sort'));
root.render(<BubbleSortVisualizer />);