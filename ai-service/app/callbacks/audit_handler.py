import logging

log = logging.getLogger('agentforge.audit')


def audit(event: str, **fields) -> None:
    log.info('%s %s', event, fields)
