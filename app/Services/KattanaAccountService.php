<?php

namespace App\Services;

use Illuminate\Http\Client\Factory as HttpFactory;
use Illuminate\Http\Client\RequestException;

class KattanaAccountService
{
    public function __construct(protected HttpFactory $http) {}

    public function launchUrl(string $returnTo): string
    {
        return sprintf(
            '%s/apps/%s/launch?return_to=%s',
            $this->baseUrl(),
            $this->appSlug(),
            urlencode($returnTo),
        );
    }

    public function logoutUrl(string $returnTo): string
    {
        return sprintf(
            '%s/apps/%s/logout?return_to=%s',
            $this->baseUrl(),
            $this->appSlug(),
            urlencode($returnTo),
        );
    }

    /**
     * @return array{
     *     uuid: string,
     *     name: string,
     *     email: string,
     *     email_verified: bool,
     *     created_at: string
     * }
     *
     * @throws RequestException
     */
    public function exchangeCode(string $code): array
    {
        $response = $this->http
            ->withBasicAuth($this->appKey(), $this->appSecret())
            ->acceptJson()
            ->post(sprintf(
                '%s/api/integrations/apps/%s/exchange',
                $this->baseUrl(),
                $this->appSlug(),
            ), [
                'code' => $code,
            ])
            ->throw();

        /** @var array{data: array{uuid: string, name: string, email: string, email_verified: bool, created_at: string}} $payload */
        $payload = $response->json();

        return $payload['data'];
    }

    protected function baseUrl(): string
    {
        return rtrim((string) config('services.kattana_account.url'), '/');
    }

    protected function appSlug(): string
    {
        return (string) config('services.kattana_account.app_slug');
    }

    protected function appKey(): string
    {
        return (string) config('services.kattana_account.app_key');
    }

    protected function appSecret(): string
    {
        return (string) config('services.kattana_account.app_secret');
    }
}
