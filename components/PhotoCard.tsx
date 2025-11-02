import React, { useState, useEffect, useRef } from 'react';
import type { Comment } from '../types';

interface PhotoCardProps {
  photoDataUrl: string;
  aiCaption: string;
  likes: number;
  comments: Comment[];
  likeLimit: number | null;
  onLike: () => void;
  onAddComment: (commentText: string) => void;
}

const CakeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 15.216a8.992 8.992 0 01-8.992 8.992A8.992 8.992 0 013 15.216V9.792a8.992 8.992 0 018.992-8.992A8.992 8.992 0 0121 9.792v5.424z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.128v2.25M15.75 6.75l-1.5 1.5M8.25 6.75l1.5 1.5M12 15.375V18" />
    </svg>
);

const FireIcon = ({ filled }: { filled: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 3.75 3.75 0 0 0-1.993-2.118 3.75 3.75 0 0 0-4.113 2.652A3.75 3.75 0 0 0 6 16.5c0 1.622.783 3.06 2.003 3.935" />
    </svg>
);


const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
    </svg>
);

export const PhotoCard: React.FC<PhotoCardProps> = ({ photoDataUrl, aiCaption, likes, comments, likeLimit, onLike, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [animateCake, setAnimateCake] = useState(false);
  const prevCommentsLength = useRef(comments.length);

  const isLimitReached = likeLimit !== null && likes >= likeLimit;

  // Effect to animate the cake icon when a new comment is added
  useEffect(() => {
    if (comments.length > prevCommentsLength.current) {
      setAnimateCake(true);
      const timer = setTimeout(() => {
        setAnimateCake(false);
      }, 500); // Animation duration in ms
      
      return () => clearTimeout(timer);
    }
    // Always update the ref to the current length for the next render
    prevCommentsLength.current = comments.length;
  }, [comments.length]);


  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddComment(newComment);
    setNewComment('');
  };

  const handleShare = () => {
    const randomId = Math.random().toString(36).substring(2, 10);
    const link = `${window.location.origin}/#shared/${randomId}`;
    setShareLink(link);
    navigator.clipboard.writeText(link).then(() => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-lg overflow-hidden animate-fade-in">
      <img src={photoDataUrl} alt="User upload" className="w-full h-auto object-cover" />
      
      <div className="p-5">
        <div className="text-white mb-4">
          <p className="opacity-90">"{aiCaption}"</p>
          <p className="text-xs opacity-60 text-right mt-1">- ✨ Wish caption by magic AI</p>
        </div>

        <div className="flex items-center justify-around text-white mb-4">
          <button 
            onClick={onLike}
            disabled={isLimitReached}
            className={`flex items-center space-x-2 transition-all transform hover:scale-110 ${isLimitReached ? 'text-yellow-400 cursor-not-allowed' : 'opacity-80 hover:opacity-100'}`}
            >
            <FireIcon filled={isLimitReached} />
            <span className="font-semibold">{likes}{likeLimit !== null && ` / ${likeLimit}`}</span>
          </button>
          <div className={`flex items-center space-x-2 opacity-80 transition-transform duration-500 ease-in-out ${animateCake ? 'scale-125' : 'scale-100'}`}>
            <CakeIcon />
            <span className="font-semibold">{comments.length}</span>
          </div>
          <button onClick={handleShare} className="flex items-center space-x-2 opacity-80 hover:opacity-100 transition-opacity transform hover:scale-110">
            <ShareIcon />
          </button>
        </div>

        {shareLink && (
            <div className="bg-black/20 p-2 rounded-lg text-center text-white text-sm mb-4">
                <p className="truncate">{shareLink}</p>
                <p className="text-xs text-green-400 mt-1">{linkCopied ? 'Copied to clipboard!' : 'Temporary link generated.'}</p>
            </div>
        )}

        <div className="max-h-32 overflow-y-auto space-y-2 mb-4 pr-2">
            {comments.map(comment => (
                <div key={comment.id} className="bg-black/20 p-2 rounded-lg text-white text-sm animate-fade-in-up">
                    {comment.text}
                </div>
            ))}
            {comments.length === 0 && <p className="text-white/60 text-sm text-center">No comments yet.</p>}
        </div>

        <form onSubmit={handleCommentSubmit} className="flex space-x-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          />
          <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Post
          </button>
        </form>
      </div>
    </div>
  );
};