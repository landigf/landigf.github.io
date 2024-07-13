
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
