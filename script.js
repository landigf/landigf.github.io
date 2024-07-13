
function toggleNav() {
    var nav = document.getElementById("nav");
    if (nav.style.display === "block") {
    nav.style.display = "none";
    } else {
    nav.style.display = "block";
    }
    }

    document.getElementById('post-form').addEventListener('submit', function(event) {
        event.preventDefault();
    
        const postContent = document.getElementById('post-content').value;
        const postImage = document.getElementById('post-image').files[0];
        const postsSection = document.getElementById('posts');
    
        const postElement = document.createElement('div');
        postElement.classList.add('post');
    
        const contentElement = document.createElement('p');
        contentElement.textContent = postContent;
        postElement.appendChild(contentElement);
    
        if (postImage) {
            const imageElement = document.createElement('img');
            imageElement.src = URL.createObjectURL(postImage);
            imageElement.alt = 'Post Image';
            postElement.appendChild(imageElement);
        }
    
        postsSection.appendChild(postElement);
    
        // Reset form
        document.getElementById('post-form').reset();
    });

document.addEventListener('DOMContentLoaded', function() {
    loadPosts();

    document.getElementById('post-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const postContent = document.getElementById('post-content').value;
        if (!postContent) return;

        const postDate = new Date().toLocaleString();
        const posts = getPostsFromLocalStorage();
        posts.push({ content: postContent, date: postDate });
        savePostsToLocalStorage(posts);

        addPostToPage(postContent, postDate);

        // Reset form
        document.getElementById('post-form').reset();
    });
});

function getPostsFromLocalStorage() {
    const posts = localStorage.getItem('posts');
    return posts ? JSON.parse(posts) : [];
}

function savePostsToLocalStorage(posts) {
    localStorage.setItem('posts', JSON.stringify(posts));
}

function loadPosts() {
    const posts = getPostsFromLocalStorage();
    posts.forEach(post => {
        addPostToPage(post.content, post.date);
    });
}

function addPostToPage(content, date) {
    const postsSection = document.getElementById('posts');
    const postElement = document.createElement('div');
    postElement.classList.add('post');

    const dateElement = document.createElement('small');
    dateElement.textContent = date;
    dateElement.classList.add('post-date');
    postElement.appendChild(dateElement);

    const contentElement = document.createElement('p');
    contentElement.textContent = content;
    postElement.appendChild(contentElement);

    postsSection.appendChild(postElement);
}
