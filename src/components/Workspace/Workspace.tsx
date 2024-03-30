"use client"
import React, { useState } from 'react';
import ProblemDescription from './ProblemDescription/ProblemDescription';
import Split from 'react-split';
import Playground from './Playground/Playground';
import { Problem } from '@/utils/types/problem';
import Confetti from 'react-confetti';
import useWindowSize from '../hooks/useWindowSize';

type WorkspaceProps = {
    problem: Problem;
};

const Workspace:React.FC<WorkspaceProps> = ({problem}) => {
    const {width,height} = useWindowSize();
    const [success, setSuccess] = useState(false); //to show confetti or not
    const [solved, setSolved] = useState(false);
    return (
        <Split className='split' minSize={0}>
            <ProblemDescription problem={problem} _solved={solved}/>
            <div className='bg-dark-fill-2'>
                <Playground problem={problem} setSuccess={setSuccess} setSolved={setSolved}/> 
                {success && (
                    <Confetti
                        gravity={0.1}
                        tweenDuration={4000}
                        width={width-1}
                        height={height-1}
                    />
                )}
                
            </div>
        </Split>
       
    )
}
export default Workspace;