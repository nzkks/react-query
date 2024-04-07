import { Fragment } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addPost, fetchPosts, fetchTags } from '../api/api';

const PostLists = () => {
  let errorMessages = [];

  const {
    status: fetchPostsStatus,
    data: postData,
    error: fetchPostsError
  } = useQuery({ queryKey: ['posts'], queryFn: fetchPosts });

  const {
    status: fetchTagsStatus,
    data: tagsData,
    error: fetchTagsError
  } = useQuery({ queryKey: ['tags'], queryFn: fetchTags });

  const { status: mutationStatus, mutate, error: mutationError } = useMutation({ mutationFn: addPost });

  if (fetchPostsStatus === 'pending' || fetchTagsStatus === 'pending' || mutationStatus === 'pending') {
    return <p>Loading...</p>;
  }

  if (fetchPostsStatus === 'error') {
    errorMessages.push(`Fetch Posts Error: ${fetchPostsError.message}`);
  }

  if (fetchTagsStatus === 'error') {
    errorMessages.push(`Fetch Tags Error: ${fetchTagsError.message}`);
  }

  if (mutationStatus === 'error') {
    errorMessages.push(`Mutation Error: ${mutationError.message}`);
  }

  const handleSubmit = e => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const title = formData.get('title');
    const tags = Array.from(formData.keys()).filter(key => formData.get(key) === 'on');

    if (!title || !tags.length) return;

    mutate({ id: postData.length + 1, title, tags });

    e.target.reset();
  };

  return (
    <div className="container">
      {errorMessages.length > 0 && (
        <div className="error">
          {errorMessages.map((message, index) => (
            <Fragment key={index}>{message}</Fragment>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Enter your post" className="postbox" name="title" />
        <div className="tags">
          {tagsData?.map(tag => (
            <div key={tag}>
              <input id={tag} name={tag} type="checkbox" />
              <label htmlFor={tag}>{tag}</label>
            </div>
          ))}
        </div>
        <button type="submit">Post</button>
      </form>

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
