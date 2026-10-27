<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_root_redirects_to_ringkasan(): void
    {
        $this->get('/')->assertRedirect('/ringkasan');
    }

    public function test_known_report_page_renders(): void
    {
        $this->withoutVite();
        $this->get('/impor/kuota')->assertOk();
    }

    public function test_unknown_report_page_is_404(): void
    {
        $this->get('/impor/tidak-ada')->assertNotFound();
    }
}
