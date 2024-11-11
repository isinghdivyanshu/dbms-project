export default function Loading() {
	return (
		<div className="h-screen bg-slate-300 flex justify-center items-center gap-5">
			<div className="flex flex-row gap-2">
				<div className="animate-bounce [animation-delay:-.3s]">
					<div className="border-t-8 rounded-full border-slate-400 bg-slate-200 animate-spin aspect-square w-8"></div>
				</div>
				<div className="animate-bounce [animation-delay:-.6s]">
					<div className="border-b-8 rounded-full border-slate-400 bg-slate-200 animate-spin aspect-square w-8"></div>
				</div>
				<div className="animate-bounce [animation-delay:-.3s]">
					<div className="border-t-8 rounded-full border-slate-400 bg-slate-200 animate-spin aspect-square w-8"></div>
				</div>
				<div className="animate-bounce [animation-delay:-.6s]">
					<div className="border-b-8 rounded-full border-slate-400 bg-slate-200 animate-spin aspect-square w-8"></div>
				</div>
			</div>
		</div>
	);
}
