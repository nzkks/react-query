import { Fragment, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addPost, fetchPosts, fetchTags } from '../api/api';

const PostLists = () => {
  const [page, setPage] = useState(1);

  let errorMessages = [];

  const {
    status: fetchPostsStatus,
    data: postData,
    error: fetchPostsError
  } = useQuery({ queryKey: ['posts', { page }], queryFn: () => fetchPosts(page) });
  // If queryFn recieves out side variables as Parameters. useQuery needs to be informed of that change through adding the variables into queryKey options.

  // If auto refetching is needed every n seconds add refetchInterval in the useQuery
  // When a query's cache becomes unused or inactive, that cache data will be garbage collected after gcTime duration. Default value is Infinity which disables manual garbage collection and will automatically clear memory once a request has finished. If not Infinity, manual garbage collection is needed. Recommended lower value is not less than 2 seconds (1000 * 2)

  const {
    status: fetchTagsStatus,
    data: tagsData,
    error: fetchTagsError
  } = useQuery({ queryKey: ['tags'], queryFn: fetchTags, staleTime: Infinity });
  {
    /* Since tags are not going to be mutated, setting the staleTime to Infinity will make it not refetching again. */
  }

  const queryClient = useQueryClient();

  const {
    status: postStatus,
    mutate,
    reset
  } = useMutation({
    mutationFn: addPost,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });

  if (fetchPostsStatus === 'pending' || fetchTagsStatus === 'pending') {
    return <p>Loading...</p>;
  }

  if (fetchPostsStatus === 'error') {
    errorMessages.push(`Fetch Posts Error: ${fetchPostsError.message}`);
  }

  if (fetchTagsStatus === 'error') {
    errorMessages.push(`Fetch Tags Error: ${fetchTagsError.message}`);
  }

  const handleSubmit = e => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const title = formData.get('title');
    const tags = Array.from(formData.keys()).filter(key => formData.get(key) === 'on');

    if (!title || !tags.length) return;

    mutate({ id: postData?.data?.length + 1, title, tags });

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

      {postStatus === 'error' && (
        <p onClick={() => reset()} className="error">
          Unable to post
        </p>
      )}

      <div className="pages">
        <button onClick={() => setPage(oldPage => Math.max(oldPage - 1, 0))} disabled={!postData.prev}>
          Previous page
        </button>
        {/* Math.max takes the seconds parameter. 0 means if the first parameter value goes beyond (less than) 0, then it is set to 0. */}
        <div>{page}</div>
        <button onClick={() => setPage(oldPage => oldPage + 1)} disabled={!postData.next}>
          Next page
        </button>
      </div>

      {postData?.data?.map(post => (
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
