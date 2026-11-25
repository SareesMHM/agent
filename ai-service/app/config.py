from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    anthropic_api_key: str = ""
    llm_model: str = "claude-sonnet-5-5"
    max_tokens: int = 4000
    internal_token: str = ""
    backend_url: str = "http://localhost:4000/api"
    workspace_dir: str = "./workspace"
    enable_code_runner: bool = False  # keep OFF unless running inside an isolated container

    @property
    def mock_mode(self) -> bool:
        return not self.anthropic_api_key


settings = Settings()
