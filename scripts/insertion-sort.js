const { useState, useEffect, useCallback } = React;

// Inline SVG Icons
const Play = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>;
const Pause = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>;
const StepForward = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>;
const RotateCcw = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>;
const Shuffle = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>;
const ArrowDownUp = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 16 4 4 4-4" /><path d="M7 20V4" /><path d="m21 8-4-4-4 4" /><path d="M17 4v16" /></svg>;

const INITIAL_ARRAY = [6, 2, 8, 1, 4, 5];

function InsertionSortVisualizer() {
    const [initialArray, setInitialArray] = useState([...INITIAL_ARRAY]);
    const [array, setArray] = useState([...INITIAL_ARRAY]);

    const [i, setI] = useState(1); // Boundary of sorted section (starts at 1)
    const [j, setJ] = useState(0); // Scanning pointer moving backwards
    const [keyVal, setKeyVal] = useState(INITIAL_ARRAY[1]); // The 'temp' variable
    const [holeIdx, setHoleIdx] = useState(1); // The current empty spot being shifted

    // States: PICK_KEY, COMPARING, SHIFT, INSERT, DONE
    const [stepState, setStepState] = useState('PICK_KEY');
    const [isAscending, setIsAscending] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(800);
    const [log, setLog] = useState("Ready! The first element is trivially sorted. Click 'Step' to begin.");

    const isComplete = stepState === 'DONE';

    const reset = useCallback((newArr = initialArray, newDir = isAscending) => {
        setIsPlaying(false);
        setArray([...newArr]);
        setInitialArray([...newArr]);
        setIsAscending(newDir);
        setI(1);
        setJ(0);
        setKeyVal(newArr[1]);
        setHoleIdx(1);
        setStepState('PICK_KEY');
        setLog(`Ready to sort in ${newDir ? 'Ascending' : 'Descending'} order.`);
    }, [initialArray, isAscending]);

    const randomize = () => {
        const newArr = Array.from({ length: 6 }, () => Math.floor(Math.random() * 9) + 1);
        reset(newArr, isAscending);
    };

    const handleStep = useCallback(() => {
        if (isComplete) return;

        if (stepState === 'PICK_KEY') {
            setKeyVal(array[i]);
            setHoleIdx(i);
            setJ(i - 1);
            setStepState('COMPARING');
            setLog(`Lifted ${array[i]} into the temp variable. Let's find its spot in the sorted section.`);

        } else if (stepState === 'COMPARING') {
            if (j >= 0) {
                const needsShift = isAscending ? array[j] > keyVal : array[j] < keyVal;
                if (needsShift) {
                    setStepState('SHIFT');
                    setLog(`${array[j]} is ${isAscending ? '>' : '<'} ${keyVal}. It needs to shift right to make room.`);
                } else {
                    setStepState('INSERT');
                    setLog(`${array[j]} is safely ${isAscending ? '<=' : '>='} ${keyVal}. We found the insertion spot!`);
                }
            } else {
                setStepState('INSERT');
                setLog(`Reached the start of the array. The temp value is the new ${isAscending ? 'minimum' : 'maximum'}!`);
            }

        } else if (stepState === 'SHIFT') {
            const newArr = [...array];
            newArr[holeIdx] = newArr[j];
            setArray(newArr);
            setHoleIdx(j);
            setJ(j - 1);
            setStepState('COMPARING');
            setLog(`Shifted ${array[j]} to the right. Moving to compare the next element.`);

        } else if (stepState === 'INSERT') {
            const newArr = [...array];
            newArr[holeIdx] = keyVal;
            setArray(newArr);

            const newI = i + 1;
            if (newI >= array.length) {
                setI(newI);
                setStepState('DONE');
                setIsPlaying(false);
                setLog("Sorting Complete! 🎉");
            } else {
                setI(newI);
                setStepState('PICK_KEY');
                setLog(`Temp inserted! The sorted section has grown. Ready for next pass.`);
            }
        }
    }, [array, i, j, keyVal, holeIdx, stepState, isAscending, isComplete]);

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

    const getBarColorClass = (index) => {
        if (isComplete) return 'bg-emerald-500 text-white shadow-sm';

        // Render the "hole" styling
        if (stepState !== 'PICK_KEY' && stepState !== 'DONE' && index === holeIdx) {
            return 'bg-slate-50 border-2 border-indigo-400 border-dashed text-transparent shadow-none';
        }

        if (stepState === 'COMPARING' && index === j) return 'bg-yellow-400 text-slate-900 shadow-sm';
        if (stepState === 'SHIFT' && index === j) return 'bg-orange-500 text-white shadow-sm';
        if (index === i && stepState === 'PICK_KEY') return 'bg-indigo-400 text-white shadow-sm';
        if (index < i) return 'bg-teal-500 text-white shadow-sm';

        return 'bg-slate-300 text-slate-700 shadow-sm';
    };

    // Ensure the "hole" is visually the height of the key that was removed
    const getBarHeight = (index, val) => {
        if (stepState !== 'PICK_KEY' && stepState !== 'DONE' && index === holeIdx) {
            return `${keyVal * 15}px`;
        }
        return `${val * 15}px`;
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 p-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">

                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-slate-900">Insertion Sort Visualizer</h1>
                    <p className="text-slate-600 text-lg">Watch the array elements shift to make room for the temp variable.</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">

                    <div className="h-16 flex items-center justify-center mb-8 bg-slate-100 rounded-lg">
                        <p className="text-xl font-medium text-slate-700">
                            {log}
                        </p>
                    </div>

                    {/* Floating Temp Variable */}
                    <div className="flex justify-center mb-8 h-24 relative z-10">
                        <div className={`flex flex-col items-center gap-2 transition-opacity duration-300 ${(stepState === 'PICK_KEY' || stepState === 'DONE') ? 'opacity-0' : 'opacity-100'}`}>
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">int temp</span>
                            <div className="w-16 h-16 flex items-center justify-center rounded-lg text-2xl font-bold bg-indigo-500 text-white shadow-lg border-2 border-indigo-600">
                                {keyVal}
                            </div>
                        </div>
                    </div>

                    {/* Array Display */}
                    <div className="flex justify-center items-end h-64 gap-4 mb-4 relative z-0">
                        {array.map((val, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2">
                                <div
                                    className={`w-16 rounded-t-md transition-all duration-300 ${getBarColorClass(idx)}`}
                                    style={{ height: getBarHeight(idx, val) }}
                                ></div>
                                <div className={`w-16 h-16 flex items-center justify-center rounded-lg text-2xl font-bold transition-colors duration-300 ${getBarColorClass(idx)}`}>
                                    {(stepState !== 'PICK_KEY' && stepState !== 'DONE' && idx === holeIdx) ? "" : val}
                                </div>
                                {/* Pointers Below the Elements */}
                                <div className="h-8 flex flex-col items-center justify-start mt-2">
                                    {!isComplete && (idx === i || idx === j || idx === holeIdx) && (
                                        <>
                                            <span className="text-slate-400 font-bold text-lg leading-none">↑</span>
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1 text-center whitespace-nowrap">
                                                {[
                                                    idx === i && stepState === 'PICK_KEY' ? 'i' : null,
                                                    idx === holeIdx && stepState !== 'PICK_KEY' ? 'hole' : null,
                                                    idx === j && stepState !== 'PICK_KEY' ? 'j' : null
                                                ].filter(Boolean).join(' / ')}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col items-center gap-6 border-t border-slate-100 pt-8 mt-8">
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

                <div className="flex flex-col gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            📝 FRQ Prep: The Code Logic
                        </h3>
                        <p className="text-sm text-slate-600 mb-4">
                            Watch how the inner <code>while</code> loop shifts elements down one index to make a "hole" for the temp variable.
                        </p>
                        <pre className="bg-slate-800 text-slate-50 p-4 rounded-xl text-sm md:text-base overflow-x-auto shadow-inner">
                            <code>
                                <span className="text-slate-400">// Start at 1 because index 0 is trivially sorted</span>
                                {`\nfor (int i = 1; i < array.length; i++) {\n  `}
                                <span className="text-slate-400">// Lift the target value out to avoid overwriting it</span>
                                {`\n  int temp = array[i];\n  int j = i - 1;\n\n  `}
                                <span className="text-slate-400">// Shift elements to the right to make room</span>
                                {`\n  `}
                                <span className="bg-indigo-600/50 px-2 py-1 rounded inline-block">
                                    {`while (j >= 0 && array[j] ${isAscending ? '>' : '<'} temp) {`}
                                </span>
                                {`\n    array[j + 1] = array[j];\n    j--;\n  }\n\n  `}
                                <span className="text-slate-400">// Insert the temp value into the hole</span>
                                {`\n  array[j + 1] = temp;\n}`}
                            </code>
                        </pre>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                        <ul className="flex flex-wrap items-center justify-center gap-6">
                            <li className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-teal-500 shrink-0"></div>
                                <span className="text-sm font-medium text-slate-700">Sorted So Far</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded border-2 border-indigo-400 border-dashed shrink-0"></div>
                                <span className="text-sm font-medium text-slate-700">The "Hole"</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-yellow-400 shrink-0"></div>
                                <span className="text-sm font-medium text-slate-700">Comparing (j)</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-orange-500 shrink-0"></div>
                                <span className="text-sm font-medium text-slate-700">Shifting Right</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-emerald-500 shrink-0"></div>
                                <span className="text-sm font-medium text-slate-700">Finished</span>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('insertion-sort'));
root.render(<InsertionSortVisualizer />);