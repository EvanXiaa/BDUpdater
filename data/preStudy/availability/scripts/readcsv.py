import pandas as pd

def get_column_with_pandas(file_path, column_name):
    """
    Reads a specific column from a CSV file into a list using pandas.

    Args:
        file_path (str): The path to the CSV file.
        column_name (str): The header name of the column to extract.

    Returns:
        list: A list of values from the specified column.
              Returns an empty list if the file or column is not found, or an error occurs.
    """
    try:
        df = pd.read_csv(file_path)
        if column_name in df.columns:
            return df[column_name].tolist()
        else:
            print(f"Error: Column '{column_name}' not found in CSV.")
            print(f"Available columns are: {df.columns.tolist()}")
            return []
    except FileNotFoundError:
        print(f"Error: File not found at '{file_path}'")
    except Exception as e:
        print(f"An error occurred with pandas: {e}")
    return []

# --- Example Usage ---
file_path = ''  # Replace with your CSV file path
column_to_extract_pd = 'other files' # Example: extract the 'language' column


files = get_column_with_pandas(file_path, column_to_extract_pd)
repos = get_column_with_pandas(file_path, "package_name")

for i, file in enumerate(files):
    file = str(file).split(';')
    repo = repos[i]