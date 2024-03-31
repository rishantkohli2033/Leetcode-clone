import Topbar from '@/components/Topbar/Topbar';
import Workspace from '@/components/Workspace/Workspace';
import { problems } from '@/utils/problems';

import React from 'react';

type ProblemPageProps = {
    params:{pid:string}
};

const ProblemPage:React.FC<ProblemPageProps> = ({params}) => {
    const {pid} = params;
    const problem = problems[pid];
    if(!problem){
        return
    }
    problem.handlerFunction = problem.handlerFunction.toString();
    
    return (
        <div>
            <Topbar problemPage={true}/>
            <Workspace problem={problem}/>
        </div>
    );
}
export default ProblemPage;
