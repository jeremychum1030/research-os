from .engine import cli

if __name__ == "__main__":
    raise SystemExit(cli(__import__("sys").argv[1:]))
