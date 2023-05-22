import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { createSpyFromClass } from 'jest-auto-spies';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { createMockHero } from '../mock-heroes';
import { HeroDetailComponent } from './hero-detail.component';

describe('HeroDetailComponent', () => {
  async function setup({ hero = createMockHero() }: { hero?: Hero } = {}) {
    const mockHeroService = createSpyFromClass(HeroService, {
      methodsToSpyOn: ['getHero'],
    });
    mockHeroService.getHero.nextWith(hero);

    const mockActivatedRoute = createSpyFromClass(ActivatedRoute, {
      observablePropsToSpyOn: ['params'],
    });
    mockActivatedRoute.params.nextWith({ id: hero.id });

    await render<HeroDetailComponent>(`<app-hero-detail></app-hero-detail>`, {
      imports: [HttpClientModule, FormsModule],
      declarations: [HeroDetailComponent],
      providers: [{ provide: HeroService, useValue: mockHeroService }],
    });
  }

  it('displays proper heading', async () => {
    await setup({ hero: createMockHero({ name: 'Test' }) });
    const title = screen.getByRole('heading');
    expect(title).toHaveTextContent('TEST Details');
  });

  it('autofills hero name input', async () => {
    await setup();
    const heroNameInput: HTMLInputElement = screen.getByLabelText('Hero name:');
    expect(heroNameInput.value).toBe('Dr. Nice');
  });
});
