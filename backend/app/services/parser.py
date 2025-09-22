from bs4 import BeautifulSoup
from typing import List

def parse_html(html_content: str) -> List[str]:
    """
    Parse Telegram HTML export and extract message texts.
    Assumes messages are in <div class="message"> elements.
    """
    soup = BeautifulSoup(html_content, 'lxml')
    messages = soup.find_all('div', class_='message')
    texts = [msg.get_text(strip=True) for msg in messages if msg.get_text(strip=True)]
    return texts