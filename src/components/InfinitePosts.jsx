import PostForm from './PostForm';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { fetchPostsInfinitely } from '../api/api';

import Post from './Post';
import { useEffect } from 'react';

const InfinitePosts = () => {
  const { ref, inView } = useInView();

  const postsQueryKey = ['posts'];

  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, isSuccess, hasNextPage } =
    useInfiniteQuery({
      queryKey: postsQueryKey,
      queryFn: fetchPostsInfinitely,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages, lastPageParam) => {
        if (lastPage.next === null) {
          return undefined;
        }
        return lastPageParam + 1;
      }
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const content =
    isSuccess &&
    data.pages.map(page =>
      page.data.map((post, i) => {
        if (post.length === i + 1) {
          return <Post ref={ref} key={post.id} post={post} />;
        }
        return <Post key={post.id} post={post} />;
      })
    );

  return (
    <div className="container">
      <PostForm postsQueryKey={postsQueryKey} />

      {status === 'pending' ? (
        <p>Loading...</p>
      ) : status === 'error' ? (
        <span>Error: {error.message}</span>
      ) : (
        <>
          {content}

          <div>
            <button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
              {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load Newer' : 'Nothing more to load'}
            </button>
          </div>
          <div>{isFetching && !isFetchingNextPage ? 'Background Updating...' : null}</div>
        </>
      )}
    </div>
  );
};

export default InfinitePosts;
