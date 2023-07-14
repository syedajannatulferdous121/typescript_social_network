// Define User class
class User {
  private friends: User[] = [];
  private messages: Map<User, string[]> = new Map<User, string[]>();

  constructor(public username: string, public email: string, private password: string) {}

  // Method to authenticate user
  authenticate(password: string): boolean {
    return this.password === password;
  }

  // Method to add a friend
  addFriend(friend: User): void {
    if (!this.friends.includes(friend)) {
      this.friends.push(friend);
    }
  }

  // Method to get a user's friends
  getFriends(): User[] {
    return this.friends;
  }

  // Method to send a direct message
  sendDirectMessage(recipient: User, message: string): void {
    let messages = this.messages.get(recipient);
    if (!messages) {
      messages = [];
      this.messages.set(recipient, messages);
    }
    messages.push(message);
  }

  // Method to get direct messages from a user
  getDirectMessagesFrom(user: User): string[] {
    const messages = this.messages.get(user);
    return messages ? messages : [];
  }
}

// Define Post class
class Post {
  private comments: Comment[] = [];

  constructor(public author: User, public content: string, public timestamp: Date) {}

  // Method to add a comment
  addComment(comment: Comment): void {
    this.comments.push(comment);
  }

  // Method to get comments
  getComments(): Comment[] {
    return this.comments;
  }
}

// Define Comment class
class Comment {
  constructor(public author: User, public content: string, public timestamp: Date) {}
}

// Define PrivacySettings class
class PrivacySettings {
  private visibleFriends: User[] = [];

  // Method to add a friend to the visible friends list
  addVisibleFriend(friend: User): void {
    if (!this.visibleFriends.includes(friend)) {
      this.visibleFriends.push(friend);
    }
  }

  // Method to remove a friend from the visible friends list
  removeVisibleFriend(friend: User): void {
    const index = this.visibleFriends.indexOf(friend);
    if (index !== -1) {
      this.visibleFriends.splice(index, 1);
    }
  }

  // Method to check if a post is visible to the user
  isPostVisible(user: User): boolean {
    return this.visibleFriends.includes(user);
  }
}

// Define SocialNetwork class
class SocialNetwork {
  private users: User[] = [];
  private posts: Post[] = [];
  private friendRequests: Map<User, User[]> = new Map<User, User[]>();
  private privacySettings: Map<User, PrivacySettings> = new Map<User, PrivacySettings>();

  // Method to register new users
  registerUser(username: string, email: string, password: string): void {
    const user = new User(username, email, password);
    this.users.push(user);
    this.friendRequests.set(user, []);
    this.privacySettings.set(user, new PrivacySettings());
  }

  // Method to authenticate users and return user object if successful
  login(username: string, password: string): User | null {
    const user = this.users.find((u) => u.username === username);
    if (user && user.authenticate(password)) {
      return user;
    }
    return null;
  }

  // Method to create and publish a new post
  createPost(user: User, content: string): void {
    const timestamp = new Date();
    const post = new Post(user, content, timestamp);
    this.posts.push(post);
  }

  // Method to display the news feed
  displayNewsFeed(user: User): void {
    const friends = this.getFriends(user);
    const allowedPosts = this.posts.filter((post) => {
      const privacy = this.privacySettings.get(post.author);
      return privacy.isPostVisible(user) || friends.includes(post.author);
    });
    for (const post of allowedPosts) {
      console.log(`${post.author.username} (${post.timestamp}): ${post.content}`);
      const comments = post.getComments();
      for (const comment of comments) {
        console.log(`  - ${comment.author.username} (${comment.timestamp}): ${comment.content}`);
      }
    }
  }

  // Method to send a friend request
  sendFriendRequest(sender: User, recipient: User): void {
    const requests = this.friendRequests.get(recipient);
    if (requests) {
      requests.push(sender);
    }
  }

  // Method to accept a friend request
  acceptFriendRequest(user: User, sender: User): void {
    const requests = this.friendRequests.get(user);
    if (requests) {
      const index = requests.indexOf(sender);
      if (index !== -1) {
        requests.splice(index, 1);
        user.addFriend(sender);
        sender.addFriend(user);
      }
    }
  }

  // Method to get a user's friends
  getFriends(user: User): User[] {
    return user.getFriends();
  }

  // Method to update privacy settings
  updatePrivacySettings(user: User, privacy: PrivacySettings): void {
    this.privacySettings.set(user, privacy);
  }

  // Method to add a comment to a post
  addCommentToPost(user: User, post: Post, content: string): void {
    const comment = new Comment(user, content, new Date());
    post.addComment(comment);
  }

  // Method to send a direct message
  sendDirectMessage(sender: User, recipient: User, message: string): void {
    sender.sendDirectMessage(recipient, message);
  }

  // Method to get direct messages from a user
  getDirectMessagesFrom(user: User): string[] {
    const currentUser = this.getCurrentUser();
    return currentUser ? currentUser.getDirectMessagesFrom(user) : [];
  }

  // Method to get the currently logged-in user
  getCurrentUser(): User | null {
    // Implement logic to get the current user based on the application's authentication system
    return null;
  }
}

// Usage example
const socialNetwork = new SocialNetwork();

// Register new users
socialNetwork.registerUser("JohnDoe", "john@example.com", "password1");
socialNetwork.registerUser("JaneSmith", "jane@example.com", "password2");

// User login
const user1 = socialNetwork.login("JohnDoe", "password1");
const user2 = socialNetwork.login("JaneSmith", "password2");

if (user1 && user2) {
  // Send friend request
  socialNetwork.sendFriendRequest(user1, user2);

  // Accept friend request
  socialNetwork.acceptFriendRequest(user2, user1);

  // Create and publish posts
  socialNetwork.createPost(user1, "Hello, everyone! This is my first post.");
  socialNetwork.createPost(user2, "Hey, friends! Just sharing a quick update.");

  // Add comments to a post
  const posts = socialNetwork.displayNewsFeed(user1);
  if (posts.length > 0) {
    const post = posts[0];
    socialNetwork.addCommentToPost(user2, post, "Great post!");
    socialNetwork.addCommentToPost(user1, post, "Thanks, Jane!");
  }

  // Update privacy settings
  const privacySettings = new PrivacySettings();
  privacySettings.addVisibleFriend(user2);
  socialNetwork.updatePrivacySettings(user1, privacySettings);

  // Send direct messages
  socialNetwork.sendDirectMessage(user1, user2, "Hey Jane, how are you?");
  socialNetwork.sendDirectMessage(user2, user1, "Hi John, I'm doing great!");

  // Display the news feed for user1
  socialNetwork.displayNewsFeed(user1);
}
