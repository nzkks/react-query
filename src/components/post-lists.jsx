import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '../api/api';

const PostLists = () => {
  let errorMessages = <div></div>;

  const {
    status: fetchPostsStatus,
    data: postData,
    error: fetchPostsError
  } = useQuery({ queryKey: ['posts'], queryFn: fetchPosts });

  if (fetchPostsStatus === 'pending') {
    return <p>Loading...</p>;
  }

  if (fetchPostsStatus === 'error') {
    errorMessages.append(`<p>Fetch Posts Error: ${fetchPostsError.message}</p>`);
  }

  return (
    <div className="container">
      {errorMessages}

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
