import os
import numpy as np
import matplotlib.pyplot as plt

def ensure_dir(path: str) -> None:
    os.makedirs(path, exist_ok=True)


def save_truth_table_image(output_path: str) -> None:
    # Rows: x, y, min (AND), max (OR), boolean AND, boolean OR
    data = np.array([
        [0, 0, 0, 0],  # x
        [0, 1, 0, 1],  # y
        [0, 0, 0, 1],  # x AND y (boolean)
        [0, 1, 1, 1],  # x OR y (boolean)
        [0, 0, 0, 1],  # min(x,y) on {0,1}
        [0, 1, 1, 1],  # max(x,y) on {0,1}
    ], dtype=float)

    row_labels = [
        "x",
        "y",
        "Boolean AND",
        "Boolean OR",
        "x∧y = min(x,y)",
        "x∨y = max(x,y)",
    ]
    col_labels = ["(0,0)", "(0,1)", "(1,0)", "(1,1)"]

    plt.figure(figsize=(9, 5))
    im = plt.imshow(data, cmap="YlGnBu", aspect="auto")
    plt.colorbar(im, fraction=0.025, pad=0.04)

    # Axes ticks/labels
    plt.xticks(range(len(col_labels)), col_labels)
    plt.yticks(range(len(row_labels)), row_labels)

    # Annotate values
    for i in range(data.shape[0]):
        for j in range(data.shape[1]):
            val = int(data[i, j])
            plt.text(j, i, str(val), ha="center", va="center", fontsize=11)

    plt.title("Truth Table Extension: Boolean vs min/max on {0,1}", fontsize=13, weight="bold")
    plt.tight_layout()
    plt.savefig(output_path, dpi=200, bbox_inches="tight")
    plt.close()


if __name__ == "__main__":
    out_dir = os.path.join("public", "DS-1")
    ensure_dir(out_dir)
    out_file = os.path.join(out_dir, "truth_table_extension.png")
    save_truth_table_image(out_file)
    print(f"Saved: {out_file}")


