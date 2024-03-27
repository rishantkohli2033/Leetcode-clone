import Topbar from '@/components/Topbar/Topbar';
import Workspace from '@/components/Workspace/Workspace';
import { problems } from '@/utils/problems';
import { Problem } from '@/utils/types/problem';
import { useParams } from 'next/navigation';
import React from 'react';

type ProblemPageProps = {
    params:{pid:string}
};

const ProblemPage:React.FC<ProblemPageProps> = async ({params}) => {
    const data = await getData(params);
    if(!data) {console.log("No Problem Available"); return;}
    return (
        <div>
            <Topbar problemPage={true}/>
            <Workspace problem={data}/>
        </div>
    );
}
export default ProblemPage;

// export async function generateStaticParams(){
//     try {
        
//         const paths = Object.keys(problems).map((key)=>({
//             params:{pid:key}
//         }))
//         console.log("genStatParams: "+paths);
//         return paths

//     } catch (error:any) {
//         console.log(error.message)
//     }
    
// }

export async function getData(params:{pid:string}) {
    try {
    const {pid} = params;
    const problem = problems[pid];
    if(!problem){
        throw new Error;
    }
    problem.handlerFunction = problem.handlerFunction.toString();
    return problem
    } catch (error:any) {
        console.log(error.message)
    }
}