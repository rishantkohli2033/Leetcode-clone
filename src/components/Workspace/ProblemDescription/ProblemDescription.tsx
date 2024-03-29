
import CircleSkeleton from "@/components/Skeletons/CircleSkeleton";
import RectangleSkeleton from "@/components/Skeletons/RectangleSkeleton";
import { auth, firestore } from "@/firebase/firebase";
import { DBProblem, Problem } from "@/utils/types/problem";
import { arrayRemove, arrayUnion, doc, getDoc, runTransaction, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { AiFillLike, AiFillDislike, AiOutlineLoading3Quarters, AiFillStar } from "react-icons/ai";
import { BsCheck2Circle } from "react-icons/bs";
import { TbJewishStarFilled, TbStarFilled } from "react-icons/tb";
import { TiStarOutline } from "react-icons/ti";
import { toast } from "react-toastify";

type ProblemDescriptionProps = {
	problem:Problem;
};

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({problem}) => {
	const [user] = useAuthState(auth);
	const {currentProblem, loading, problemDifficultyColor, setCurrentProblem} = useGetCurrentProblem(problem.id);
	const {liked,disliked,solved,setData,starred} = useGetUsersDataOnProblem(problem.id);
	const [updating, setUpdating] = useState(false); //loading state for like, dislike

	const returnUserAndProblemData = async (transaction:any) => {
		const userRef = doc(firestore, "users", user!.uid);
		const problemRef = doc(firestore, "problems", problem.id);
		const userDoc = await transaction.get(userRef);
		const problemDoc = await transaction.get(problemRef);
		return {userDoc, problemDoc, userRef, problemRef};
	}

	const handleLike = async ()=>{
		if (!user) {
			toast.error("You must be logged in to like a problem", { position: "top-left", theme: "dark" });
			return;
		}

		if (updating) return; //We can't like or dislike while updating/loading

		setUpdating(true);
		await runTransaction(firestore, async(transaction)=>{ //transaction will fail if even one function fails so everything should work for smoother transaction
			const {problemDoc, userDoc, userRef, problemRef} = await returnUserAndProblemData(transaction);

			if(userDoc.exists() && problemDoc.exists()){
				if(liked){

					//if user already liked a problem then liking again will result in decrement of like value and removal of problem id from likedProblems on user document

					transaction.update(userRef, {
						likedProblems: userDoc.data().likedProblems.filter((id: string) => id !== problem.id),
					}); //removing current problem from problems array
					
					transaction.update(problemRef, {
						likes: problemDoc.data().likes - 1,
					});// decreasing like value

					//above will reflect in database
					//work done below will reflect in frontend
					setCurrentProblem((prev) => (prev ? { ...prev, likes: prev.likes - 1 } : null));
					setData((prev) => ({ ...prev, liked: false }));

				}else if(disliked){

					//if user liked a problem which was disliked by him then liking will result in decrement of disliked value and removal of problem id from dislikedProblems

					//while increasing like value and adding the problem in liked array on user document
					transaction.update(userRef, {
						dislikedProblems: userDoc.data().dislikedProblems.filter((id: string) => id !== problem.id),
						likedProblems: [...userDoc.data().likedProblems, problem.id],
					}); //removing current problem from dislike array and adding it to like array

					transaction.update(problemRef, {
						dislikes: problemDoc.data().dislikes - 1,
						likes: problemDoc.data().likes + 1,
					});// decreasing dislike value and increasing like value
			
					//above will reflect in database
					//work done below will reflect in frontend
					setCurrentProblem((prev) => (prev ? { ...prev, dislikes: prev.dislikes - 1, likes: prev.likes + 1 } : null));
					setData((prev) => ({ ...prev, liked: true, disliked: false }));

				} else {

					//if user didn't already liked aor disliked the problem then we will just add problem in liked array fro user document and update likes in problem document

					transaction.update(userRef, {
						likedProblems: [...userDoc.data().likedProblems, problem.id],
					}); //adding current problem in likes array

					transaction.update(problemRef, {
						likes: problemDoc.data().likes + 1,
					});// increasing like value


					//above will reflect in database
					//work done below will reflect in frontend
					setCurrentProblem((prev) => (prev ? { ...prev, likes: prev.likes + 1 } : null));
					setData((prev) => ({ ...prev, liked: true }));

				}
			}
		});
		setUpdating(false);
	}

	const handleDislike = async () => {
		if (!user) {
			toast.error("You must be logged in to dislike a problem", { position: "top-left", theme: "dark" });
			return;
		}

		if (updating) return; //We can't like or dislike while updating/loading

		setUpdating(true);
		await runTransaction(firestore, async(transaction)=>{
			const {problemDoc, userDoc, userRef, problemRef} = await returnUserAndProblemData(transaction);

			if(userDoc.exists() && problemDoc.exists()){

				if(disliked){

					//if user already liked a problem then liking again will result in decrement of like value and removal of problem id from likedProblems on user document

					transaction.update(userRef, {
						dislikedProblems: userDoc.data().dislikedProblems.filter((id: string) => id !== problem.id),
					}); //removing current problem from problems array

					transaction.update(problemRef, {
						dislikes: problemDoc.data().dislikes - 1,
					});// decreasing like value

					//above will reflect in database
					//work done below will reflect in frontend
					setCurrentProblem((prev) => (prev ? { ...prev, dislikes: prev.dislikes - 1 } : null));
					setData((prev) => ({ ...prev, disliked: false }));

				}else if(liked){

					//if user liked a problem which was disliked by him then liking will result in decrement of disliked value and removal of problem id from dislikedProblems
					//while increasing like value and adding the problem in liked array on user document

					transaction.update(userRef, {
						likedProblems: userDoc.data().likedProblems.filter((id: string) => id !== problem.id),
						dislikedProblems: [...userDoc.data().dislikedProblems, problem.id],
					}); //removing current problem from dislike array and adding it to like array

					transaction.update(problemRef, {
						dislikes: problemDoc.data().dislikes + 1,
						likes: problemDoc.data().likes - 1,
					});// decreasing dislike value and increasing like value
			
					//above will reflect in database
					//work done below will reflect in frontend
					setCurrentProblem((prev) => (prev ? { ...prev, dislikes: prev.dislikes + 1, likes: prev.likes - 1 } : null));
					setData((prev) => ({ ...prev, liked: false, disliked: true }));

				} else {

					//if user didn't already liked aor disliked the problem then we will just add problem in liked array fro user document and update likes in problem document

					transaction.update(userRef, {
						dislikedProblems: [...userDoc.data().dislikedProblems, problem.id],
					}); //adding current problem in likes array

					transaction.update(problemRef, {
						dislikes: problemDoc.data().dislikes + 1,
					});// increasing like value

					//above will reflect in database
					//work done below will reflect in frontend
					setCurrentProblem((prev) => (prev ? { ...prev, dislikes: prev.dislikes + 1 } : null));
					setData((prev) => ({ ...prev, disliked: true }));

				}
			}
		});
		setUpdating(false);
	}

	const handleStar = async () => {
		if (!user) {
			toast.error("You must be logged in to star a problem", { position: "top-left", theme: "dark" });
			return;
		}
		if (updating) return;
		setUpdating(true);
		//as we are not updating multiple documents that are depenendent on each other's info, here we can use basic methods to update our fields instead of using transaction
		if (!starred) {
			const userRef = doc(firestore, "users", user.uid);
			await updateDoc(userRef, {
				starredProblems: arrayUnion(problem.id),
			});
			setData((prev) => ({ ...prev, starred: true }));
		} else {
			const userRef = doc(firestore, "users", user.uid);
			await updateDoc(userRef, {
				starredProblems: arrayRemove(problem.id),
			});
			setData((prev) => ({ ...prev, starred: false }));
		}

		setUpdating(false);
	};
	return (
		<div className='bg-dark-layer-1'>
			{/* TAB */}
			<div className='flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden'>
				<div className={"bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"}>
					Description
				</div>
			</div>

			<div className='flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto'>
				<div className='px-5'>
					{/* Problem heading */}
					<div className='w-full'>
						<div className='flex space-x-4'>
							<div className='flex-1 mr-2 text-lg text-white font-medium'>{problem.title}</div>
						</div>
						{!loading && currentProblem && (
							<div className='flex items-center mt-3'>
								<div
									className={`${problemDifficultyColor} inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize `}
								>
									{currentProblem.difficulty}
								</div>
								<div className='rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-green-s'>
									<BsCheck2Circle />
								</div>
								<div className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-dark-gray-6'
								   onClick={handleLike}
								>
									{liked && !updating && <AiFillLike className='text-dark-blue-s' />}
									{!liked && !updating && <AiFillLike />}
									{updating && <AiOutlineLoading3Quarters className='animate-spin' />}
									<span className='text-xs'>{currentProblem.likes}</span>
								</div>
								<div className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-green-s text-dark-gray-6'
									onClick={handleDislike}
								>
									{disliked && !updating && <AiFillDislike className='text-red-600' />}
									{!disliked && !updating && <AiFillDislike />}
									{updating && <AiOutlineLoading3Quarters className='animate-spin' />}
									<span className='text-xs'>{currentProblem.dislikes}</span>
								</div>
								<div className='cursor-pointer hover:bg-dark-fill-3  rounded p-[3px]  ml-4 text-xl transition-colors duration-200 text-green-s text-dark-gray-6 '
									onClick={handleStar}
								>
									{starred && !updating && <AiFillStar className='text-dark-yellow' />}
									{!starred && !updating && <TiStarOutline />}
									{updating && <AiOutlineLoading3Quarters className='animate-spin' />}
									
								</div>
							</div>
						)}

						{loading && (
							<div className='mt-3 flex space-x-2'>
								<RectangleSkeleton />
								<CircleSkeleton />
								<RectangleSkeleton />
								<RectangleSkeleton />
								<CircleSkeleton />
							</div>
						)}
						{/* Problem Statement(paragraphs) */}
						<div className='text-white text-sm'>
							{/* To set string as an html */}
							<div dangerouslySetInnerHTML={{__html: problem.problemStatement}}/>
							
						</div>

						{/* Examples */}
						<div className='mt-4'>
							{/* Example 1 */}
							{problem.examples.map((example, idx) => {
								return (<div key={example.id}>
									<p className='font-medium text-white '>Example {idx+1}: </p>
									{example.img && (
										<img src={example.img} alt={"image"} className="mt-3"/>
									)}
									<div className='example-card'>
										<pre>
											<strong className='text-white'>Input: </strong> {example.inputText}
											<br />
											<strong>Output:</strong> {example.outputText} <br />
											{example.explanation && 
												(
													<>
														<strong>Explanation:</strong>{example.explanation}
													</>
												)
											}
										</pre>
									</div>
								</div>)
							})}
						</div>

						{/* Constraints */}
						<div className='my-8 pb-2'>
							<div className='text-white text-sm font-medium'>Constraints:</div>
							<ul className='text-white ml-5 list-disc'>
							<div dangerouslySetInnerHTML={{__html: problem.constraints}}/>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default ProblemDescription;

function useGetCurrentProblem(problemId: string){
	const [currentProblem, setCurrentProblem] = useState<DBProblem | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [problemDifficultyColor, setProblemDifficultyColor] = useState<string>("")
	useEffect(()=>{
		const getProblem = async ()=>{
			setLoading(true);
			const query = doc(firestore, "problems", problemId);
			const docSnap = await getDoc(query);

			if (docSnap.exists()) {
				const problem = docSnap.data();
				setCurrentProblem({id: docSnap.id, ...problem} as DBProblem);
				setProblemDifficultyColor(
					problem.difficulty === "Easy"
						? "bg-olive text-olive"
						: problem.difficulty === "Medium"
						? "bg-dark-yellow text-dark-yellow"
						: " bg-dark-pink text-dark-pink"
				);
			} else {
				console.log("No such document!");
			}
			setLoading(false);
		}
		getProblem();
	},[problemId]);
	
	return {currentProblem, loading, problemDifficultyColor, setCurrentProblem};
}

function useGetUsersDataOnProblem(problemId: string) {
	const [data, setData] = useState({ liked: false, disliked: false, starred: false, solved: false });
	const [user] = useAuthState(auth);

	useEffect(() => {
		const getUsersDataOnProblem = async () => {
			const userRef = doc(firestore, "users", user!.uid);
			const userSnap = await getDoc(userRef);
			if (userSnap.exists()) {
				const data = userSnap.data();
				const { solvedProblems, likedProblems, dislikedProblems, starredProblems } = data;
				setData({
					liked: likedProblems.includes(problemId), // if it includes the given problemId then liked will become true, else false
					disliked: dislikedProblems.includes(problemId),
					starred: starredProblems.includes(problemId),
					solved: solvedProblems.includes(problemId),
				});
			}
		};

		if (user) getUsersDataOnProblem();
		return () => setData({ liked: false, disliked: false, starred: false, solved: false });//to reset state when this function unmounts
	}, [problemId, user]);

	return { ...data, setData };
}