#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
检查源代码中硬编码的中文文本
"""

import os
import re
from pathlib import Path
from typing import List, Dict, Tuple

# 中文正则表达式
CHINESE_REGEX = re.compile(r'[\u4e00-\u9fa5]+')

# 需要忽略的文件和目录
IGNORE_PATTERNS = [
    'node_modules',
    'dist',
    '.git',
    'skills',
    '.agents',
    '.iflow',
    '.claude',
    'scripts/check_hardcoded_text.py',
    'package.json',
    'package-lock.json',
    'tsconfig',
    'vite.config.ts',
    'tailwind.config.js',
    'postcss.config.js',
    'eslint.config.js',
    'components.json',
    '.md',
]

# 需要忽略的行模式
IGNORE_LINE_PATTERNS = [
    # 单行注释
    re.compile(r'^\s*//.*[\u4e00-\u9fa5]'),
    # 多行注释开始
    re.compile(r'^\s*/\*.*[\u4e00-\u9fa5]'),
    # 已经使用翻译的代码
    re.compile(r'translations\.[\w.]+\s*\|\|'),
    re.compile(r"t\([\"'`][\u4e00-\u9fa5]"),
]

# 需要扫描的文件扩展名
SCAN_EXTENSIONS = {'.tsx', '.ts', '.jsx', '.js'}


def should_ignore_file(file_path: Path) -> bool:
    """检查文件是否应该被忽略"""
    relative_path = file_path.relative_to(Path.cwd())
    
    for pattern in IGNORE_PATTERNS:
        if pattern in str(relative_path):
            return True
    
    return False


def should_ignore_line(line: str) -> bool:
    """检查行是否应该被忽略"""
    for pattern in IGNORE_LINE_PATTERNS:
        if pattern.search(line):
            return True
    return False


def scan_file(file_path: Path) -> List[Dict]:
    """扫描单个文件"""
    findings = []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except Exception as e:
        print(f"⚠️  无法读取文件 {file_path}: {e}")
        return findings
    
    for line_num, line in enumerate(lines, 1):
        matches = CHINESE_REGEX.findall(line)
        
        if matches and not should_ignore_line(line):
            findings.append({
                'line': line_num,
                'text': line.strip(),
                'matches': matches
            })
    
    return findings


def scan_directory(directory: Path) -> List[Dict]:
    """递归扫描目录"""
    results = []
    
    for item in directory.iterdir():
        if item.is_dir():
            results.extend(scan_directory(item))
        elif item.is_file() and item.suffix in SCAN_EXTENSIONS:
            if not should_ignore_file(item):
                findings = scan_file(item)
                if findings:
                    results.append({
                        'file': str(item.relative_to(Path.cwd())),
                        'findings': findings
                    })
    
    return results


def main():
    """主函数"""
    print("🔍 扫描硬编码的中文文本...\n")
    
    src_dir = Path.cwd() / 'src'
    
    if not src_dir.exists():
        print(f"❌ 目录不存在: {src_dir}")
        return
    
    results = scan_directory(src_dir)
    
    if not results:
        print("✅ 未发现硬编码的中文文本！")
    else:
        print(f"⚠️  在 {len(results)} 个文件中发现硬编码的中文文本：\n")
        
        for idx, result in enumerate(results, 1):
            print(f"{idx}. {result['file']}")
            print('   ' + '─' * 60)
            
            for finding in result['findings']:
                print(f"   行 {finding['line']}: {finding['text']}")
                print(f"   匹配: {', '.join(finding['matches'])}")
                print()
            
            print()
        
        total = sum(len(r['findings']) for r in results)
        print(f"\n总计: {total} 处硬编码文本")


if __name__ == '__main__':
    main()
