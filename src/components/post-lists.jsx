import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '../api/api';

const PostLists = () => {
  const { status, data: postData, error } = useQuery({ queryKey: ['posts'], queryFn: fetchPosts });

  if (status === 'pending') {
    return <p>Loading...</p>;
  }
  if (status === 'error') {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="container">
      {postData.map(post => (
        <div key={post.id} className="post">
          <div>{post.title}</div>
          {post.tags.map(tag => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PostLists;
