<?php

namespace Tests;

use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        if ($this->shouldAuthenticateByDefault()) {
            $this->actingAs(User::factory()->create());
        }
    }

    protected function shouldAuthenticateByDefault(): bool
    {
        return true;
    }
}
