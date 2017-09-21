# siadri-web

> Sistema Integral para la Administración de la Dirección de Relaciones Internacionales de la Universidad Del Valle - SIADRI -

------------

#### Flujo de Trabajo en el Repositorio

El repositorio está configurado con dos ramas, durante la etapa de desarrollo se trabaja sobre la rama **develop** y en la rama **master** se mantiene el codigo fuente que está en producción.

Todos los **desarrolladores** que contribuyen al repositorio ***sólo pueden realizar push sobre la rama develop*** y solo un usuario con el rol de administrador del repositorio puede hacer push o merge sobre la rama master.

El usuario con el rol de administrador del repositorio es el encargado de hacer cada merge de la rama develop a la rama master y generar tags de cada versión del repositorio que se despliega en producción.

------------

**1. Clonar repositorio**

`git clone git@gitlab.com:univalle/siadri-web.git`

**2. Usar rama develop**

`git brach develop`

Los pasos **1. Clonar repositorio** y **2. Usar rama develop** sólo se deberían hacer una vez cuando el desarrollador se une al repositorio.

Se recomienda ejecutar un **pull cada vez que el desarrollador inicia trabajo al incio del día** para actualizar su repositorio local con los cambios que existan en el repositorio remoto.

**3. Actualizar repositorio local**

`git pull origin develop`

**4. Agregar cambios en repositorio local**

Para agregar cambios al repositorio local ejecutar desde la raiz del repositorio:

`git add .`

**5. Commit de cambios**

Para mantener un trazabilidad de los cambios generados en el repositorio se debe agregar a cada commit un mensaje descriptivo de forma clara y resumida sobre los cambios realizados, así los otros desarrolladores conocen claramente los cambios que se hicieron.

`git commit -m "Se actualiza el archivo README con descripcion del repositorio"`

Se recomienda ejecutar un **push cada vez que el desarrollador termina trabajo al final del día** para actualizar el repositorio remoto con los cambios de su repositorio local.

**5. Agregar cambios en repositorio remoto**

`git push origin develop`

Como parte del trabajo del equipo de desarrollo, el equipo debe adoptar una metodología para organizar su trabajo en el repositorio, solo el equípo de desarrollo es el responsable de administrar su trabajo en el repositorio para reducir tanto como sea posible la generación de conflictos en los cambios hechos en el repositorio al momento de realizar tareas de push o pull.

------------PRUEBA! NATIVO

#### Estructura del Repositorio

	siadri-web/
		angular/
		docs/
		sinangular/
		.gitignore
		README.md
