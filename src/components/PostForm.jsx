import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addPost, fetchTags } from '../api/api';

const PostForm = ({ postData, page }) => {
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
      queryClient.invalidateQueries({ queryKey: ['posts', { page }] });
    }
  });

  const handleSubmit = e => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const title = formData.get('title');
    const tags = Array.from(formData.keys()).filter(key => formData.get(key) === 'on');

    if (!title || !tags.length) return;

    mutate({ id: postData?.data?.length + 1, title, tags });

    e.target.reset();
  };

  if (fetchTagsStatus === 'pending') {
    return <p>Loading...</p>;
  }

  if (fetchTagsStatus === 'error') {
    return <p>Fetch Tags Error: {fetchTagsError.message}</p>;
  }

  return (
    <>
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
    </>
  );
};

export default PostForm;
