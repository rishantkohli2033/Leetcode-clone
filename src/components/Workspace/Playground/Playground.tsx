import React from 'react';
import PreferenceNav from './PreferenceNav/PreferenceNav';
import Split from 'react-split';
import ReactCodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import EditorFooter from './EditorFooter';

type PlaygroundProps = {
    
};

const Playground:React.FC<PlaygroundProps> = () => {
    const boilerPlate = `function twoSum(nums, target){
        //Write your code here
};`;
    return (
        <div className='flex flex-col bg-dark-layer-1 relative overflow-x-hidden'>
			<PreferenceNav 
            // settings={settings} setSettings={setSettings}
             />

			<Split className='h-[calc(100vh-94px)]' direction='vertical' sizes={[60, 40]} minSize={60}>
				<div className='w-full overflow-auto'>
					<ReactCodeMirror
						 value={boilerPlate}
						 theme={vscodeDark}
						// onChange={onChange}
						 extensions={[javascript()]}
						 style={{ fontSize: 16 }}
					/>
				</div>
				<div className='w-full px-5 overflow-auto'>
					{/* testcase heading */}
					<div className='flex h-10 items-center space-x-6'>
						<div className='relative flex h-full flex-col justify-center cursor-pointer'>
							<div className='text-sm font-medium leading-5 text-white'>Testcases</div>
							<hr className='absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white' />
						</div>
					</div>

					<div className='flex'>
					    {/* {problem.examples.map((example, index) => ( */}
							<div
								className='mr-2 items-start mt-2 '
								//key={example.id}
								//onClick={() => setActiveTestCaseId(index)}
							>
								<div className='flex flex-wrap items-center gap-y-4'>
									<div
										className={`font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
									text-white 
									`}
                                    // ${activeTestCaseId === index ? "text-white" : "text-gray-500"}
									>
										Case 1
                                        {/* {index + 1} */}
									</div>
								</div>
							</div>
						{/* ))} */}
					</div>

					<div className='font-semibold my-4'>
						<p className='text-sm font-medium mt-4 text-white'>Input:</p>
						<div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
							{/* {problem.examples[activeTestCaseId].inputText} */}
                            nums: [2,7,11,15], target: 9
						</div>
						<p className='text-sm font-medium mt-4 text-white'>Output:</p>
						<div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
							{/* {problem.examples[activeTestCaseId].outputText} */}
                            26
						</div>
					</div>
				</div>
			</Split>
			<EditorFooter 
            //handleSubmit={handleSubmit} 
            />
		</div>
    )
}
export default Playground;