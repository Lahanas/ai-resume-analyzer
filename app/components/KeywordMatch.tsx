import { cn } from "~/lib/utils";

const KeywordMatch = ({ keywordMatch }: { keywordMatch: KeywordMatch }) => {
    const { matchPercentage, matched, missing } = keywordMatch;

    return (
        <div
            className={cn(
                "rounded-2xl shadow-md w-full bg-gradient-to-b to-light-white p-8 flex flex-col gap-4",
                matchPercentage > 69
                    ? "from-green-100"
                    : matchPercentage > 39
                    ? "from-yellow-100"
                    : "from-red-100"
            )}
        >
            <div className="flex flex-row gap-4 items-center">
                <p className="text-2xl font-semibold">Keyword Match - {matchPercentage}%</p>
            </div>
            <p className="text-lg text-gray-500">
                How many terms from the job description actually show up in your resume text.
            </p>

            {matched.length > 0 && (
                <div className="flex flex-col gap-2">
                    <p className="font-medium text-gray-700">Found in your resume</p>
                    <div className="flex flex-row gap-2 flex-wrap">
                        {matched.map((word) => (
                            <span
                                key={word}
                                className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium"
                            >
                                {word}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {missing.length > 0 && (
                <div className="flex flex-col gap-2">
                    <p className="font-medium text-gray-700">Missing from your resume</p>
                    <div className="flex flex-row gap-2 flex-wrap">
                        {missing.map((word) => (
                            <span
                                key={word}
                                className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium"
                            >
                                {word}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default KeywordMatch;
