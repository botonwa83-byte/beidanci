# Claude 记忆备份

这里是 Claude Code 为本项目生成的「记忆」文件备份，随仓库同步到 GitHub，
防止换电脑后丢失。原始位置在本机隐藏目录：

```
~/.claude/projects/<项目绝对路径编码>/memory/
```

（编码 = 项目绝对路径里的 `/` 全部换成 `-`，开头再加一个 `-`，含用户名，所以换电脑会变。）

## 换电脑 / 重装后如何恢复

1. 在新电脑上用 Claude Code 打开本项目一次（它会自动创建上面那个 memory 目录）。
2. 把本文件夹里的 `*.md`（除 README 外）拷回该 memory 目录，覆盖即可。
3. 也可以直接让 Claude 读 `claude-memory/` 下的文件来恢复上下文。

> 在 Finder 里看隐藏文件夹：按 Cmd + Shift + .（句号）。
