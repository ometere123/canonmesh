"""Direct Mode compatibility helpers for the Windows development runner.

genlayer-test 0.29.2 closes the temporary file descriptor only after replacing
stdin, then unlinks the still-open file. Windows rejects that unlink. Keep the
test harness's real fd-0 message injection and defer only this cleanup failure;
the contract is still loaded and executed by Direct Mode.
"""

import os
import tempfile
from pathlib import Path

import pytest


@pytest.fixture(autouse=True)
def allow_genlayer_test_windows_temp_cleanup(monkeypatch):
    unlink = os.unlink
    temp_dir = Path(tempfile.gettempdir()).resolve()

    def unlink_after_fd_injection(path):
        try:
            unlink(path)
        except PermissionError as error:
            candidate = Path(path)
            if not (
                getattr(error, "winerror", None) == 32
                and candidate.parent.resolve() == temp_dir
                and candidate.name.startswith("tmp")
            ):
                raise

    # loader imports os inside the affected function, so patch the shared
    # module for the duration of this test only.
    monkeypatch.setattr(os, "unlink", unlink_after_fd_injection)
