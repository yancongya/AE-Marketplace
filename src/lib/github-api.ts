import { Octokit } from 'octokit';

export interface GitHubFile {
  path: string;
  content: string;
  sha: string;
}

export class GitHubAPI {
  private octokit: Octokit;
  private owner: string;
  private repo: string;
  
  constructor(accessToken: string, owner: string, repo: string) {
    this.octokit = new Octokit({ auth: accessToken });
    this.owner = owner;
    this.repo = repo;
  }
  
  // 读取文件
  async readFile(path: string): Promise<GitHubFile> {
    const { data } = await this.octokit.rest.repos.getContent({
      owner: this.owner,
      repo: this.repo,
      path,
    });
    
    if ('content' in data && 'sha' in data) {
      return {
        path: data.path,
        content: atob(data.content),
        sha: data.sha,
      };
    }
    
    throw new Error('Invalid file response');
  }
  
  // 写入/创建文件
  async writeFile(path: string, content: string, message: string = 'Update file'): Promise<void> {
    try {
      // 先检查文件是否存在
      const existingFile = await this.octokit.rest.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path,
      }).catch(() => null);
      
      if (existingFile && 'sha' in existingFile.data) {
        // 更新现有文件
        await this.octokit.rest.repos.createOrUpdateFileContents({
          owner: this.owner,
          repo: this.repo,
          path,
          message,
          content: btoa(content),
          sha: existingFile.data.sha,
        });
      } else {
        // 创建新文件
        await this.octokit.rest.repos.createOrUpdateFileContents({
          owner: this.owner,
          repo: this.repo,
          path,
          message,
          content: btoa(content),
        });
      }
    } catch (error) {
      console.error('Failed to write file:', error);
      throw error;
    }
  }
  
  // 删除文件
  async deleteFile(path: string, message: string = 'Delete file'): Promise<void> {
    const { data } = await this.octokit.rest.repos.getContent({
      owner: this.owner,
      repo: this.repo,
      path,
    });
    
    if ('sha' in data) {
      await this.octokit.rest.repos.deleteFile({
        owner: this.owner,
        repo: this.repo,
        path,
        message,
        sha: data.sha,
      });
    }
  }
  
  // 列出目录内容
  async listDirectory(path: string = ''): Promise<string[]> {
    const { data } = await this.octokit.rest.repos.getContent({
      owner: this.owner,
      repo: this.repo,
      path,
    });
    
    if (Array.isArray(data)) {
      return data
        .filter(item => item.type === 'file')
        .map(item => item.path);
    }
    
    return [];
  }
}