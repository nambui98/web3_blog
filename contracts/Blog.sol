// contracts/Blog.sol
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Blog {
    string public name;
    address public owner;

    using Counters for Counters.Counter;
    Counters.Counter private _postIds;

    struct Post {
      uint id;
      string title;
      string content;
      bool published;
    }
    /* mappings can be seen as hash tables */
    /* here we create lookups for posts by id and posts by ipfs hash */
    mapping(uint => Post) private idToPost;
    mapping(string => Post) private hashToPost;
    /* events facilitate communication between smart contractsand their user interfaces  */
    /* i.e. we can create listeners for events in the client and also use them in The Graph  */
    event PostCreated(uint id, string title, string hash);
    event PostUpdated(uint id, string title, string hash, bool published);
    event PostDelete(uint id);

    /* when the blog is deployed, give it a name */
    /* also set the creator as the owner of the contract */
    constructor(string memory _name) {
        console.log("Deploying Blog with name:", _name);
        name = _name;
        owner = msg.sender;
    }

    /* updates the blog name */
    function updateName(string memory _name) public {
        name = _name;
    }

    /* transfers ownership of the contract to another address */
    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }

    /* fetches an individual post by the content hash */
    function fetchPost(string memory hash) public view returns(Post memory){
      return hashToPost[hash];
    }

    /* creates a new post */
    function createPost(string memory title, string memory hash) public onlyOwner {
        _postIds.increment();
        uint postId = _postIds.current();
        Post storage post = idToPost[postId];
        post.id = postId;
        post.title = title;
        post.published = true;
        post.content = hash;
        hashToPost[hash] = post;
        emit PostCreated(postId, title, hash);
    }
    /* delete a new post */
    function deletePost(uint postId) public onlyOwner {
        // Post storage post = idToPost[postId];
        // Post memory post = hashToPost[hash];
        // uint postId = post.id;
        delete idToPost[postId];
        emit PostDelete(postId);
    }
    /* updates an existing post */
    function updatePost(uint postId, string memory title, string memory hash, bool published) public onlyOwner {
        Post storage post =  idToPost[postId];
        post.title = title;
        post.published = published;
        post.content = hash;
        idToPost[postId] = post;
        hashToPost[hash] = post;
        emit PostUpdated(post.id, title, hash, published);
    }

    /* fetches all posts */
    function fetchPosts() public view returns (Post[] memory) {
        uint itemCount = _postIds.current();
         uint lengthArr = 0;
        uint currentIndex = 0;
         for (uint i = 1; i < itemCount+1; i++) {
          if (idToPost[i].published==true && idToPost[i].id!=0) {
           lengthArr+=1;
          } 
        }

        Post[] memory posts = new Post[](lengthArr);
        for (uint i = 1; i < itemCount+1; i++) {
          if (idToPost[i].published) {    
            Post storage currentItem = idToPost[i];
            posts[currentIndex] = currentItem;
            currentIndex += 1;
          } 
        }
        return posts;
    }

    /* this modifier means only the contract owner can */
    /* invoke the function */
    modifier onlyOwner() {
      require(msg.sender == owner);
    _;
  }
}