import pandas as pd
from io import StringIO
from typing import List, Dict, Any

def export_to_csv(job_posts: List[Dict[str, Any]]) -> str:
    """
    Export list of job posts to CSV string.
    """
    df = pd.DataFrame(job_posts)
    csv_buffer = StringIO()
    df.to_csv(csv_buffer, index=False)
    return csv_buffer.getvalue()