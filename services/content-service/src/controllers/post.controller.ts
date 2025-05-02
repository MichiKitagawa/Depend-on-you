import { Request, Response } from 'express';
import { PostService } from '@src/services/post.service';

export class PostController {
  private postService: PostService;

  constructor() {
    this.postService = new PostService();
  }

  // 認証ミドルウェアなどで req.user.id にユーザーIDが設定される想定
  private getAuthorId(req: Request): string {
      // return req.user.id; // 本来の実装
      // return 'dummy-author-id'; // テスト用ダミーID
      if (!(req as any).userId) throw new Error('userId not found in request');
      return (req as any).userId;
  }

  async createPost(req: Request, res: Response): Promise<void> {
    try {
      const authorId = this.getAuthorId(req);
      const { magazineId } = req.params;
      const { title, content, published } = req.body;
      if (!title || !content) {
        res.status(400).json({ error: 'Title and content are required' });
        return;
      }
      const post = await this.postService.createPost({ magazineId, title, content, published }, authorId);
      if (!post) {
          res.status(403).json({ error: 'Not authorized to create post in this magazine' });
          return;
      }
      res.status(201).json(post);
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Failed to create post' });
    }
  }

  async getPostById(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const post = await this.postService.getPostById(postId);
      if (!post) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }
      res.status(200).json(post);
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({ error: 'Failed to fetch post' });
    }
  }

  async getPostsByMagazineId(req: Request, res: Response): Promise<void> {
      try {
          const { magazineId } = req.params;
          const posts = await this.postService.getPostsByMagazineId(magazineId);
          res.status(200).json(posts);
      } catch (error) {
          console.error('Error fetching posts by magazine:', error);
          res.status(500).json({ error: 'Failed to fetch posts' });
      }
  }

  async updatePost(req: Request, res: Response): Promise<void> {
    try {
      const authorId = this.getAuthorId(req);
      const { postId } = req.params; // ルート定義で postId を使う想定
      const { title, content, published } = req.body;
      const updatedPost = await this.postService.updatePost(postId, { title, content, published }, authorId);
      if (!updatedPost) {
        res.status(404).json({ error: 'Post not found or not authorized to update' });
        return;
      }
      res.status(200).json(updatedPost);
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ error: 'Failed to update post' });
    }
  }

  async deletePost(req: Request, res: Response): Promise<void> {
    try {
      const authorId = this.getAuthorId(req);
      const { postId } = req.params;
      const deleted = await this.postService.deletePost(postId, authorId);
      if (!deleted) {
        res.status(404).json({ error: 'Post not found or not authorized to delete' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ error: 'Failed to delete post' });
    }
  }
} 