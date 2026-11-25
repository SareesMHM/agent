from enum import Enum


class DocType(str, Enum):
    SRS = 'SRS'
    BRD = 'BRD'
    ARCHITECTURE = 'ARCHITECTURE'
    API_DOCS = 'API_DOCS'
    DB_DESIGN = 'DB_DESIGN'
    TEST_PLAN = 'TEST_PLAN'
    REPORT = 'REPORT'
    PROPOSAL = 'PROPOSAL'
    JOB_DESCRIPTIONS = 'JOB_DESCRIPTIONS'
