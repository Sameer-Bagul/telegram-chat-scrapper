import pandas as pd
import re
from typing import List, Dict, Any
from datetime import datetime


class ExcelExporter:
    """Service for exporting job data to Excel format with enhanced features"""
    
    def __init__(self):
        self.email_patterns = [
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            r'\b[A-Za-z0-9._%+-]+\s*@\s*[A-Za-z0-9.-]+\s*\.\s*[A-Z|a-z]{2,}\b',
            r'\b[A-Za-z0-9._%+-]+\(at\)[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        ]
        
        self.name_patterns = [
            r'(?:contact|reach out|email|send cv|apply to|hr|recruiter|hiring manager)[\s:]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)',
            r'(?:contact person|contact|coordinator|manager)[\s:]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
            r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)(?:\s*-\s*(?:hr|recruiter|hiring|manager|coordinator))',
            r'(?:for more details|contact|reach)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)'
        ]
    
    def extract_emails(self, text: str) -> List[str]:
        """Extract email addresses from text"""
        if not text:
            return []
        
        emails = set()
        for pattern in self.email_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                # Clean up the email
                clean_email = re.sub(r'\s+', '', match).replace('(at)', '@').lower()
                if '@' in clean_email and '.' in clean_email:
                    emails.add(clean_email)
        
        return list(emails)
    
    def extract_names(self, text: str) -> List[str]:
        """Extract contact names from text"""
        if not text:
            return []
        
        names = set()
        for pattern in self.name_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                if match.group(1):
                    name = match.group(1).strip()
                    # Filter out false positives
                    if (len(name) > 2 and 
                        'job' not in name.lower() and 
                        'work' not in name.lower() and
                        'position' not in name.lower() and
                        len(name.split()) <= 4):
                        names.add(name)
        
        return list(names)
    
    def extract_contact_info(self, jobs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Extract contact information from job data"""
        contact_info = []
        
        for idx, job in enumerate(jobs):
            text = f"{job.get('description', '')} {job.get('company', '')} {job.get('role', '')}"
            emails = self.extract_emails(text)
            names = self.extract_names(text)
            
            if emails or names:
                for email in emails:
                    contact_info.append({
                        'Job_Index': idx + 1,
                        'Company': job.get('company', 'Unknown'),
                        'Role': job.get('role', 'Unknown'),
                        'Email': email,
                        'Name': names[0] if names else '',
                        'Source': 'Extracted from job posting',
                        'Extraction_Date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    })
                
                # If names but no emails
                if not emails and names:
                    for name in names:
                        contact_info.append({
                            'Job_Index': idx + 1,
                            'Company': job.get('company', 'Unknown'),
                            'Role': job.get('role', 'Unknown'),
                            'Email': '',
                            'Name': name,
                            'Source': 'Extracted from job posting',
                            'Extraction_Date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                        })
        
        return contact_info
    
    def format_jobs_for_excel(self, jobs: List[Dict[str, Any]]) -> pd.DataFrame:
        """Format job data for Excel export with enhanced information"""
        formatted_data = []
        
        for idx, job in enumerate(jobs):
            description = job.get('description', '')
            emails = self.extract_emails(description)
            names = self.extract_names(description)
            
            formatted_data.append({
                'S_No': idx + 1,
                'Company': job.get('company', ''),
                'Job_Role': job.get('role', ''),
                'Location': job.get('location', ''),
                'Description': description,
                'Timestamp': job.get('timestamp', ''),
                'Extracted_Emails': ', '.join(emails),
                'Extracted_Names': ', '.join(names),
                'Contact_Count': len(emails) + len(names),
                'Has_Contact_Info': 'Yes' if emails or names else 'No'
            })
        
        return pd.DataFrame(formatted_data)
    
    def create_excel_file(self, jobs: List[Dict[str, Any]], filename: str) -> str:
        """Create Excel file with job data and return file path"""
        
        # Create job data sheet
        job_df = self.format_jobs_for_excel(jobs)
        
        # Create contact info sheet
        contact_info = self.extract_contact_info(jobs)
        contact_df = pd.DataFrame(contact_info)
        
        # Create summary sheet
        summary_data = {
            'Metric': [
                'Total Jobs',
                'Jobs with Contact Info',
                'Total Emails Found',
                'Total Names Found',
                'Unique Companies',
                'Export Date'
            ],
            'Value': [
                len(jobs),
                len([job for job in jobs if self.extract_emails(job.get('description', '')) or self.extract_names(job.get('description', ''))]),
                len(set([email for job in jobs for email in self.extract_emails(job.get('description', ''))])),
                len(set([name for job in jobs for name in self.extract_names(job.get('description', ''))])),
                len(set([job.get('company', 'Unknown') for job in jobs if job.get('company')])),
                datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            ]
        }
        summary_df = pd.DataFrame(summary_data)
        
        # Write to Excel with multiple sheets
        with pd.ExcelWriter(filename, engine='openpyxl') as writer:
            job_df.to_excel(writer, sheet_name='Job_Data', index=False)
            
            if not contact_df.empty:
                contact_df.to_excel(writer, sheet_name='Contact_Info', index=False)
            
            summary_df.to_excel(writer, sheet_name='Summary', index=False)
            
            # Auto-adjust column widths
            for sheet_name in writer.sheets:
                worksheet = writer.sheets[sheet_name]
                for column in worksheet.columns:
                    max_length = 0
                    column_letter = column[0].column_letter
                    for cell in column:
                        try:
                            if len(str(cell.value)) > max_length:
                                max_length = len(str(cell.value))
                        except:
                            pass
                    adjusted_width = min(max_length + 2, 50)  # Cap at 50 characters
                    worksheet.column_dimensions[column_letter].width = adjusted_width
        
        return filename
    
    def create_contacts_only_excel(self, jobs: List[Dict[str, Any]], filename: str) -> str:
        """Create Excel file with only contact information"""
        contact_info = self.extract_contact_info(jobs)
        
        if not contact_info:
            # Create empty file with headers
            empty_df = pd.DataFrame(columns=[
                'Job_Index', 'Company', 'Role', 'Email', 'Name', 
                'Source', 'Extraction_Date'
            ])
            empty_df.to_excel(filename, index=False)
            return filename
        
        contact_df = pd.DataFrame(contact_info)
        
        # Create summary for contacts
        summary_data = {
            'Metric': [
                'Total Contacts Found',
                'Contacts with Email',
                'Contacts with Name Only',
                'Unique Emails',
                'Unique Names',
                'Export Date'
            ],
            'Value': [
                len(contact_info),
                len([c for c in contact_info if c['Email']]),
                len([c for c in contact_info if c['Name'] and not c['Email']]),
                len(set([c['Email'] for c in contact_info if c['Email']])),
                len(set([c['Name'] for c in contact_info if c['Name']])),
                datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            ]
        }
        summary_df = pd.DataFrame(summary_data)
        
        with pd.ExcelWriter(filename, engine='openpyxl') as writer:
            contact_df.to_excel(writer, sheet_name='Contacts', index=False)
            summary_df.to_excel(writer, sheet_name='Summary', index=False)
            
            # Auto-adjust column widths
            for sheet_name in writer.sheets:
                worksheet = writer.sheets[sheet_name]
                for column in worksheet.columns:
                    max_length = 0
                    column_letter = column[0].column_letter
                    for cell in column:
                        try:
                            if len(str(cell.value)) > max_length:
                                max_length = len(str(cell.value))
                        except:
                            pass
                    adjusted_width = min(max_length + 2, 50)
                    worksheet.column_dimensions[column_letter].width = adjusted_width
        
        return filename