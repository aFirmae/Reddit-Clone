async function handleVote(postId, voteType) {
    try {
        const response = await fetch(`/posts/${postId}/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ vote: voteType })
        });

        if (!response.ok) {
            throw new Error('Failed to vote');
        }

        const data = await response.json();
        
        // Update vote counts in the UI
        const postCard = document.querySelector(`[data-post-id="${postId}"]`);
        const upvoteCount = postCard.querySelector('.upvote-count');
        const downvoteCount = postCard.querySelector('.downvote-count');
        const upvoteBtn = postCard.querySelector('.upvote');
        const downvoteBtn = postCard.querySelector('.downvote');

        // Update the counts
        upvoteCount.textContent = data.upvotes;
        downvoteCount.textContent = data.downvotes;

        // Toggle active classes
        if (voteType === 'up') {
            upvoteBtn.classList.toggle('active');
            downvoteBtn.classList.remove('active');
        } else {
            downvoteBtn.classList.toggle('active');
            upvoteBtn.classList.remove('active');
        }

    } catch (error) {
        console.error('Error voting:', error);
        alert('Failed to vote. Please try again.');
    }
}

async function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) {
        return;
    }

    try {
        const response = await fetch(`/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete post');
        }

        // Remove the post from the UI
        const postCard = document.querySelector(`[data-post-id="${postId}"]`);
        postCard.remove();
    } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post. Please try again.');
    }
}