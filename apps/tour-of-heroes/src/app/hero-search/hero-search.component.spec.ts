import { render, screen } from '@testing-library/angular';
import { HeroSearchComponent } from './hero-search.component';
import { HttpClientModule } from '@angular/common/http';
import { createSpyFromClass } from 'jest-auto-spies';
import { HeroService } from '../hero.service';
import { Hero } from '../hero';
import { HEROES } from '../mock-heroes';
import userEvent from '@testing-library/user-event';

describe('HeroSearchComponent', () => {
  async function setup({ heroes = HEROES }: { heroes?: Hero[] } = {}) {
    const mockHeroService = createSpyFromClass(HeroService, {
      methodsToSpyOn: ['searchHeroes'],
    });
    mockHeroService.searchHeroes.nextWith(heroes);

    await render<HeroSearchComponent>(`<app-hero-search></app-hero-search>`, {
      imports: [HttpClientModule],
      declarations: [HeroSearchComponent],
      providers: [{ provide: HeroService, useValue: mockHeroService }],
    });

    return { mockHeroService };
  }

  it('searches heroes when user types in search input', async () => {
    const { mockHeroService } = await setup();
    const searchInput: HTMLInputElement = screen.getByLabelText('Hero Search');

    expect(searchInput).toBeInTheDocument();
    expect(mockHeroService.searchHeroes).not.toHaveBeenCalled();

    const user = userEvent.setup();
    await user.type(searchInput, 'test');

    expect(searchInput.value).toBe('test');
    expect(mockHeroService.searchHeroes).toHaveBeenNthCalledWith(4, 'test');
  });
});
